// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr-U7LjA8fZsi7Utr_yL7jIRfBAtx6xLQ",
  authDomain: "leanrecords-1f1db.firebaseapp.com",
  databaseURL: "https://leanrecords-1f1db-default-rtdb.firebaseio.com",
  projectId: "leanrecords-1f1db",
  storageBucket: "leanrecords-1f1db.appspot.com",
  messagingSenderId: "1042353696649",
  appId: "1:1042353696649:web:63ed464023220d3e2bbb58",
  measurementId: "${config.measurementId}"
};

// const prodFirebaseConfig = {
//   apiKey: "AIzaSyCRAtqznmntoJwycPPbdaY-lkNOvJlHS_M",
//   authDomain: "wapplyprod-699c1.firebaseapp.com",
//   databaseURL: "https://wapplyprod-699c1-default-rtdb.firebaseio.com",
//   projectId: "wapplyprod-699c1",
//   storageBucket: "wapplyprod-699c1.appspot.com",
//   messagingSenderId: "506264227317",
//   appId: "1:506264227317:web:9122bd45b106cd252ca4bc",
//   measurementId: "G-FSV8PZYJ1C"
// };

// Initialize Firebase
// if (!getApps().length) {
//   initializeApp(firebaseConfig);
// }

// const app = initializeApp(prodFirebaseConfig);
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);
const functions = getFunctions(app);
export { auth, database, firestore, functions }
