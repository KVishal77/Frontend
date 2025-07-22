import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDCCLccFUfPty_hWgbtIHxw9eiGNb7xgfY",
    authDomain: "shazamforplants.firebaseapp.com",
    projectId: "shazamforplants",
    storageBucket: "shazamforplants.firebasestorage.app",
    messagingSenderId: "182602060589",
    appId: "1:182602060589:web:b6068c51953a2469b479a4",
    measurementId: "G-JNQ08HGKWF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);