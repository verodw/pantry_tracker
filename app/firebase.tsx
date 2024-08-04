// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoYWilZh9UexjP2x7Eyyv35XhkF1Ibtqg",
  authDomain: "hspantryapp-7a95e.firebaseapp.com",
  projectId: "hspantryapp-7a95e",
  storageBucket: "hspantryapp-7a95e.appspot.com",
  messagingSenderId: "714207083121",
  appId: "1:714207083121:web:1337988399698f35fa39d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore, firebaseConfig };