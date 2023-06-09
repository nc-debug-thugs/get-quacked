import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  onSnapshot
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
const app = initializeApp(firebaseConfig);

// Init services
const db = getFirestore(app)

export let highscores = []

export function getScores() {
  // Collection ref
  const colRef = collection(db, "scores");
  // construct query
  const q = query(collection(db, 'scores'), orderBy('score', 'desc'))
  // Get collection data
  onSnapshot (q, (snapshot) => {
    console.log('getting snapshot')
    highscores = []
    snapshot.forEach((doc)=> { highscores.push({score: doc.get('score'), name: doc.get('username')})});
    console.log(highscores)
  })
}

export function addScore(score, name) {
  const colRef = collection(db, "scores");
  addDoc(colRef, {
    score: score,
    username: name,
  })   
}