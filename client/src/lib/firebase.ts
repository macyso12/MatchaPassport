import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA28ZSWH3NlGo78SCPeo0NLsNev9Ti1nxA",
  authDomain: "matchamap-27b0c.firebaseapp.com",
  projectId: "matchamap-27b0c",
  storageBucket: "matchamap-27b0c.firebasestorage.app",
  messagingSenderId: "259437531481",
  appId: "1:259437531481:web:343dfb71f7d7b84559bc48",
  measurementId: "G-E8Y9ZP4ZTZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Add additional settings to help with domain issues
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Sign in successful:', result.user.email);
    return result;
  } catch (error) {
    console.error('Detailed sign in error:', error);
    throw error;
  }
};

export const signOutUser = () => {
  return signOut(auth);
};
