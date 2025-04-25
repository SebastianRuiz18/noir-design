// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCIFriqRvAbFhJo3LcmpTtZ39Mi36vxT2M",
    authDomain: "noir-catalog.firebaseapp.com",
    projectId: "noir-catalog",
    storageBucket: "noir-catalog.firebasestorage.app",
    messagingSenderId: "756731212566",
    appId: "1:756731212566:web:fe2b96b1cffd59b5635637"
};

// Inicializa la app
const app = initializeApp(firebaseConfig);

// Exporta servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
