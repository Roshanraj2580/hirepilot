
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
   authDomain: "hirepilot-82332.firebaseapp.com",
  projectId: "hirepilot-82332",
  storageBucket: "hirepilot-82332.firebasestorage.app",
  messagingSenderId: "414629206158",
  appId: "1:414629206158:web:ec6f0ea13e39f6080111df" 
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}