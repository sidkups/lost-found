import { auth, db, storage } from './app.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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

    if (!db || !storage) {
        showError(errorEl, "Firebase is not fully configured.");
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

        // 1. Upload Image to Firebase Storage (if provided)
        if (imageFile) {
            // Generate a unique filename using timestamp and UID
            const fileName = `items/${currentUser.uid}_${Date.now()}_${imageFile.name}`;
            const storageRef = ref(storage, fileName);
            
            submitBtn.textContent = 'Uploading Image...';
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // 2. Save document to Firestore
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
