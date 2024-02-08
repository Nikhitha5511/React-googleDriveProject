
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { FieldValue } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBT3j1A0L0zP42TbACmaGtfNiIbKHVAAcY",
  authDomain: "drive-project-d674e.firebaseapp.com",
  projectId: "drive-project-d674e",
  storageBucket: "drive-project-d674e.appspot.com",
  messagingSenderId: "367324615436",
  appId: "1:367324615436:web:beab65d5f9cd547b766f29"
};


const app =firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, storage, auth, provider, FieldValue };

