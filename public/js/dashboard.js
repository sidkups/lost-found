import { auth, db } from './app.js';
import { collection, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const userReportsList = document.getElementById('userReportsList');

if (auth && db) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await fetchUserReports(user.uid);
        }
    });
}

const fetchUserReports = async (uid) => {
    try {
        if (!userReportsList) return;

        const q = query(
            collection(db, "items"),
            where("reportedBy", "==", uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        userReportsList.innerHTML = ''; // Clear loading message

        if (querySnapshot.empty) {
            userReportsList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; opacity: 0.7; padding: 2rem;">
                    <p>You haven't reported any items yet.</p>
                </div>
            `;
            return;
        }

        querySnapshot.forEach((doc) => {
            const item = { id: doc.id, ...doc.data() };
            renderItemCard(item, userReportsList);
        });

    } catch (error) {
        console.error("Error fetching user reports:", error);
        if (error.code === 'failed-precondition') {
             // This usually means an index is building or required. 
             // Without index, orderBy("createdAt", "desc") with a where() clause will fail.
             // We fallback to just where() if index fails.
             console.warn("Index might be missing. Falling back to un-ordered query.");
             try {
                const qFallback = query(
                    collection(db, "items"),
                    where("reportedBy", "==", uid)
                );
                const querySnapshotFallback = await getDocs(qFallback);
                userReportsList.innerHTML = '';
                
                if (querySnapshotFallback.empty) {
                    userReportsList.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; opacity: 0.7; padding: 2rem;">
                            <p>You haven't reported any items yet.</p>
                        </div>
                    `;
                    return;
                }
                
                let itemsFallback = [];
                querySnapshotFallback.forEach((d) => itemsFallback.push({id: d.id, ...d.data()}));
                // Sort client side
                itemsFallback.sort((a,b) => {
                    let aTime = a.createdAt ? a.createdAt.toMillis() : 0;
                    let bTime = b.createdAt ? b.createdAt.toMillis() : 0;
                    return bTime - aTime;
                });
                itemsFallback.forEach((item) => renderItemCard(item, userReportsList));
             } catch (fallbackError) {
                userReportsList.innerHTML = `<p class="text-center" style="grid-column: 1 / -1; color: #ff3b30;">Error loading reports.</p>`;
             }
        } else {
             userReportsList.innerHTML = `<p class="text-center" style="grid-column: 1 / -1; color: #ff3b30;">Error loading reports.</p>`;
        }
    }
};

const renderItemCard = (item, container) => {
    const date = item.date ? new Date(item.date).toLocaleDateString() : 'Unknown Date';
    const typeClass = item.type === 'lost' ? 'badge-lost' : 'badge-found';
    const statusClass = item.status === 'open' ? 'badge-open' : 'badge-resolved';
    
    // Determine card structure for dashboard
    // I am copying the styles used in browse.js to keep it consistent
    const imageUrl = item.imageUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="%23ffffff" opacity="0.2" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';

    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.cssText = `
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
    `;

    card.innerHTML = `
        <div style="width: 100%; height: 200px; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; overflow: hidden;">
            ${!item.imageUrl ? `<div style="width:100%;height:100%;background-image:url('${imageUrl}')"></div>` : `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">`}
        </div>
        <div style="padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
                <span style="padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase;" class="${typeClass}">${item.type}</span>
                <span style="padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase;" class="${statusClass}">${item.status}</span>
            </div>
            <h3 style="margin-top: 0.5rem; margin-bottom: 0.25rem; font-size: 1.25rem;">${escapeHTML(item.title)}</h3>
            <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.5rem;"><strong>Location:</strong> ${escapeHTML(item.location || 'N/A')}</p>
            <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 1rem; flex-grow: 1;">
                ${escapeHTML(item.description ? item.description.substring(0, 80) + (item.description.length > 80 ? '...' : '') : 'No description')}
            </p>
            <div style="display: flex; justify-content: space-between; opacity: 0.7; font-size: 0.85rem;">
                <span>${escapeHTML(item.category)}</span>
                <span>${date}</span>
            </div>
        </div>
    `;

    container.appendChild(card);
};

const escapeHTML = (str) => {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
};
