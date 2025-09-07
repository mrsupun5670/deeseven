import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaOZS-YYm_UhISaSlewChWhw-__21kB98",
  authDomain: "deezeven-fb05b.firebaseapp.com",
  projectId: "deezeven-fb05b",
  storageBucket: "deezeven-fb05b.firebasestorage.app",
  messagingSenderId: "590776456655",
  appId: "1:590776456655:web:f0a3d805771d71cd916eba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, provider, signInWithPopup, facebookProvider }; 