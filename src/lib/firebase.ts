// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-7798022864-95d4a",
  "appId": "1:544924222308:web:6a952dc75072b6066f3071",
  "storageBucket": "studio-7798022864-95d4a.firebasestorage.app",
  "apiKey": "AIzaSyAbAesQWNzSEmdcHGlkFfyNsT_Y1HVBiH4",
  "authDomain": "studio-7798022864-95d4a.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "544924222308"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
