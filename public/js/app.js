// Firebase configuration will be injected here
// TODO: Replace with actual Firebase Config provided by the user
const firebaseConfig = {
    apiKey: "AIzaSyD5Z7chaFPPHfGqx84PMsWyNM-21fDLKB4",
    authDomain: "lost-found-d7880.firebaseapp.com",
    projectId: "lost-found-d7880",
    storageBucket: "lost-found-d7880.appspot.com",
    messagingSenderId: "509636494210",
    appId: "1:509636494210:web:d5f8999a3fc8976b5ac59b",
    measurementId: "G-VLMGJQSLSD"
};

// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        console.log("Firebase initialized successfully");
    } else {
        console.warn("Firebase config is missing. Please update app.js with your project config.");
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

export { auth, db, storage };
