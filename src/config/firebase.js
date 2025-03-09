import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtZyPScwTUw-G30StJilTG7AKDvhx7mVo",
  authDomain: "irai-17b31.firebaseapp.com",
  projectId: "irai-17b31",
  storageBucket: "irai-17b31.firebasestorage.app",
  messagingSenderId: "946542637548",
  appId: "1:946542637548:web:6d55d7c1b95feb73e250c9",
  measurementId: "G-GCJNDPK7YV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, signOut }; 