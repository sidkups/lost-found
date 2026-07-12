import { db } from './app.js';
import { collection, query, orderBy, limit, getDocs, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const itemsGrid = document.getElementById('itemsGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const filterCategory = document.getElementById('filterCategory');
const filterStatus = document.getElementById('filterStatus');

let allItems = []; // Store fetched items for client-side filtering

const fetchItems = async () => {
    if (!db) {
        console.error("Firebase DB not initialized.");
        loadingIndicator.textContent = "Error: Database not connected.";
        return;
    }

    try {
        loadingIndicator.classList.remove('hidden');
        itemsGrid.classList.add('hidden');

        // Build the Firestore query
        let itemsRef = collection(db, "items");
        // We'll limit to 100 recent items for the basic implementation
        let q = query(itemsRef, orderBy('createdAt', 'desc'), limit(100));

        const querySnapshot = await getDocs(q);
        allItems = [];
        
        querySnapshot.forEach((doc) => {
            allItems.push({ id: doc.id, ...doc.data() });
        });

        applyFilters();

    } catch (error) {
        console.error("Error fetching items:", error);
        loadingIndicator.textContent = "Error loading items. Please try again later.";
    }
};

const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const typeValue = filterType.value;
    const categoryValue = filterCategory.value;
    const statusValue = filterStatus.value;

    const filteredItems = allItems.filter(item => {
        // Keyword Search (Title, Description, Location)
        const matchSearch = searchTerm === '' || 
                            (item.title && item.title.toLowerCase().includes(searchTerm)) ||
                            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
                            (item.location && item.location.toLowerCase().includes(searchTerm));

        // Dropdown Filters
        const matchType = typeValue === 'all' || item.type === typeValue;
        const matchCategory = categoryValue === 'all' || item.category === categoryValue;
        const matchStatus = statusValue === 'all' || item.status === statusValue;

        return matchSearch && matchType && matchCategory && matchStatus;
    });

    renderItems(filteredItems);
};

const renderItems = (items) => {
    loadingIndicator.classList.add('hidden');
    itemsGrid.classList.remove('hidden');
    itemsGrid.innerHTML = '';

    if (items.length === 0) {
        itemsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No items found</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const date = item.date ? new Date(item.date).toLocaleDateString() : 'Unknown Date';
        const typeClass = item.type === 'lost' ? 'badge-lost' : 'badge-found';
        const statusClass = item.status === 'open' ? 'badge-open' : 'badge-resolved';
        
        // Placeholder image if none provided
        const imageUrl = item.imageUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="%23ffffff" opacity="0.2" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-image" style="background-image: url('${item.imageUrl ? imageUrl : ''}');">
                ${!item.imageUrl ? imageUrl : `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">`}
            </div>
            <div class="item-details">
                <div class="item-meta">
                    <span class="badge ${typeClass}">${item.type}</span>
                    <span class="badge ${statusClass}">${item.status}</span>
                </div>
                <h3 class="mt-2 mb-1" style="font-size: 1.25rem;">${escapeHTML(item.title)}</h3>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.5rem;">
                    <strong>Location:</strong> ${escapeHTML(item.location || 'N/A')}
                </p>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 1rem; flex-grow: 1;">
                    ${escapeHTML(item.description ? item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '') : 'No description')}
                </p>
                <div class="item-meta" style="margin-bottom: 0;">
                    <span><small>${escapeHTML(item.category)}</small></span>
                    <span><small>${date}</small></span>
                </div>
            </div>
        `;
        itemsGrid.appendChild(card);
    });
};

// Utility to prevent XSS
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

// Event Listeners for Filters
searchInput.addEventListener('input', applyFilters);
filterType.addEventListener('change', applyFilters);
filterCategory.addEventListener('change', applyFilters);
filterStatus.addEventListener('change', applyFilters);

// Initial Fetch
document.addEventListener('DOMContentLoaded', fetchItems);
