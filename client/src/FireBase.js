// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "mern-blog-399b0.firebaseapp.com",
  projectId: "mern-blog-399b0",
  storageBucket: "mern-blog-399b0.appspot.com",
  messagingSenderId: "93195268582",
  appId: "1:93195268582:web:820409cc775df4e71be627",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
