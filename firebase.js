import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByppDAEwSkZ9HpHvqNToyNbnt8zgLM1p8",
  authDomain: "get-quacked-3dfed.firebaseapp.com",
  projectId: "get-quacked-3dfed",
  storageBucket: "get-quacked-3dfed.appspot.com",
  messagingSenderId: "993090585296",
  appId: "1:993090585296:web:a44120657c99a2afe294d5",
  measurementId: "G-LCM4YZG99Q",
};

// Init firebase app
initializeApp(firebaseConfig);

// Init services
const db = getFirestore();

// Collection ref
const colRef = collection(db, "scores");

// Get collection data
getDocs(colRef).then((snapshot) => {
  console.log(snapshot.docs);
});

// Adding documents
addDoc(colRef, {
  score: 0,
  username: "USR",
});

// Deleting documents
const docRef = doc(db, "scores", "refId");

deleteDoc(docRef);
