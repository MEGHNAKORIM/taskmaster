import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD8Dl3QjeYWmRcC5QJ5Tw0vw1Q6oWrHxPs",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-cost-tracker"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-cost-tracker",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-cost-tracker"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "580574653559",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:580574653559:web:a7d35c40975fa89e26b2ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = async (): Promise<void> => {
  return signOut(auth);
};

// Firestore functions - Items
export const addItem = async (userId: string, name: string, cost: number) => {
  const itemsRef = collection(db, "users", userId, "items");
  const newItem = {
    name,
    cost,
    createdAt: new Date()
  };
  return setDoc(doc(itemsRef), newItem);
};

export const getItems = async (userId: string) => {
  const itemsRef = collection(db, "users", userId, "items");
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateItem = async (userId: string, itemId: string, data: { name?: string, cost?: number }) => {
  const itemRef = doc(db, "users", userId, "items", itemId);
  return updateDoc(itemRef, data);
};

export const deleteItem = async (userId: string, itemId: string) => {
  const itemRef = doc(db, "users", userId, "items", itemId);
  return deleteDoc(itemRef);
};

// Firestore functions - Other Costs
export const addOtherCost = async (userId: string, description: string, amount: number) => {
  const costsRef = collection(db, "users", userId, "otherCosts");
  const newCost = {
    description,
    amount,
    createdAt: new Date()
  };
  return setDoc(doc(costsRef), newCost);
};

export const getOtherCosts = async (userId: string) => {
  const costsRef = collection(db, "users", userId, "otherCosts");
  const snapshot = await getDocs(costsRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateOtherCost = async (userId: string, costId: string, data: { description?: string, amount?: number }) => {
  const costRef = doc(db, "users", userId, "otherCosts", costId);
  return updateDoc(costRef, data);
};

export const deleteOtherCost = async (userId: string, costId: string) => {
  const costRef = doc(db, "users", userId, "otherCosts", costId);
  return deleteDoc(costRef);
};
