// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "urban-vista-c613c.firebaseapp.com",
  projectId: "urban-vista-c613c",
  storageBucket: "urban-vista-c613c.firebasestorage.app",
  messagingSenderId: "990020735484",
  appId: "1:990020735484:web:c2182cda36250e5a752279",
  measurementId: "G-FCDKQSTGHY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);