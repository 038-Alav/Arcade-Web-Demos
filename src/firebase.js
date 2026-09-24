import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMQi9lQeQkm4YCATkNwfepzHUbx2UmuYk",
    authDomain: "arcadeleaderboard-53854.firebaseapp.com",
    projectId: "arcadeleaderboard-53854",
    storageBucket: "arcadeleaderboard-53854.firebasestorage.app",
    messagingSenderId: "1044202587881",
    appId: "1:1044202587881:web:28305597bc01f076a31278"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);