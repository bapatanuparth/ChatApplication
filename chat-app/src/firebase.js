// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS9kYJJQ9Axb5Nc3vuRYwQRR21JXjMUMg",
  authDomain: "chat-7b00b.firebaseapp.com",
  projectId: "chat-7b00b",
  storageBucket: "chat-7b00b.appspot.com",
  messagingSenderId: "590589500901",
  appId: "1:590589500901:web:9abf6cf16441b7ec20630c",
  measurementId: "G-QS30033EKF",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); //authenticate users
export const storage = getStorage(app); //store images
export const db = getFirestore(app); //store the database of users and user chats
const analytics = getAnalytics(app);
