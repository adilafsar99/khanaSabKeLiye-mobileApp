import {initializeApp} from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut} from "firebase/auth";
import {getFirestore, collection, doc, addDoc, setDoc, updateDoc, getDoc, getDocs, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALNzODNTsgPjYEIr9m6661RPqRLWa5Ekk",
  authDomain: "practice-project-2-d8b7e.firebaseapp.com",
  databaseURL: "https://practice-project-2-d8b7e-default-rtdb.firebaseio.com",
  projectId: "practice-project-2-d8b7e",
  storageBucket: "practice-project-2-d8b7e.appspot.com",
  messagingSenderId: "968935591437",
  appId: "1:968935591437:web:14884138c28a173d648f44"
}

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  db,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
};