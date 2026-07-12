import { auth, db } from './app.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Ensure user is authenticated before allowing submission
let currentUser = null;
if (auth) {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        // If not logged in and on a report page, redirect
        if (!user && (window.location.pathname.includes('report-lost.html') || window.location.pathname.includes('report-found.html'))) {
            window.location.href = 'login.html';
        }
    });
}

const handleFormSubmit = async (e, form, errorEl, successEl, submitBtn) => {
    e.preventDefault();
    
    if (!currentUser) {
        showError(errorEl, "You must be logged in to report an item.");
        return;
    }

    if (!db) {
        showError(errorEl, "Firebase Database is not fully configured.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');

    try {
        const type = document.getElementById('itemType').value;
        const title = document.getElementById('itemTitle').value;
        const category = document.getElementById('itemCategory').value;
        const description = document.getElementById('itemDescription').value;
        const date = document.getElementById('itemDate').value;
        const location = document.getElementById('itemLocation').value;
        const imageFile = document.getElementById('itemImage').files[0];

        let imageUrl = null;

        // 1. Process Image to Base64 (if provided)
        if (imageFile) {
            submitBtn.textContent = 'Processing Image...';
            imageUrl = await compressImageToBase64(imageFile, 800, 800, 0.7);
        }

        console.log("2. Saving document to Firestore...");
        submitBtn.textContent = 'Saving Report...';
        const itemData = {
            type: type,
            title: title,
            category: category,
            description: description,
            date: date,
            location: location,
            imageUrl: imageUrl,
            status: 'open',
            reportedBy: currentUser.uid,
            createdAt: serverTimestamp()
        };

        console.log("Item data prepared:", itemData);
        console.log("Calling addDoc...");
        
        const docRef = await addDoc(collection(db, "items"), itemData);
        console.log("Document written with ID: ", docRef.id);

        successEl.textContent = 'Item reported successfully! Redirecting...';
        successEl.classList.remove('hidden');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    } catch (error) {
        console.error("Error reporting item:", error);
        showError(errorEl, `An error occurred: ${error.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Report';
    }
};

const showError = (element, message) => {
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
};

// Bind forms
const reportLostForm = document.getElementById('reportLostForm');
if (reportLostForm) {
    const errorEl = document.getElementById('reportError');
    const successEl = document.getElementById('reportSuccess');
    const submitBtn = document.getElementById('reportSubmitBtn');
    reportLostForm.addEventListener('submit', (e) => handleFormSubmit(e, reportLostForm, errorEl, successEl, submitBtn));
}

const reportFoundForm = document.getElementById('reportFoundForm');
if (reportFoundForm) {
    const errorEl = document.getElementById('reportError');
    const successEl = document.getElementById('reportSuccess');
    const submitBtn = document.getElementById('reportSubmitBtn');
    reportFoundForm.addEventListener('submit', (e) => handleFormSubmit(e, reportFoundForm, errorEl, successEl, submitBtn));
}

/**
 * Compresses an image and returns a Base64 data URL.
 * This allows us to store images directly in Firestore (limit 1MB/doc) without needing Firebase Storage.
 */
const compressImageToBase64 = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate the new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                // Draw to canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Get base64 string
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                
                // Firestore document limit is 1MB. Warn if still too large (~750KB base64 is close to 1MB)
                if (dataUrl.length > 750000) {
                    reject(new Error("Image is too large even after compression. Please use a smaller image."));
                } else {
                    resolve(dataUrl);
                }
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
