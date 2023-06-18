// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGYanpFwGlohrirpVZ-SVgyCyWVv0Rsb0",
  authDomain: "planner-app-d5a1a.firebaseapp.com",
  projectId: "planner-app-d5a1a",
  storageBucket: "planner-app-d5a1a.appspot.com",
  messagingSenderId: "88414469744",
  appId: "1:88414469744:web:3815ed99052b331f457eb5",
  measurementId: "G-HRN2TW119C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);