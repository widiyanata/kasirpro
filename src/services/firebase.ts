import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcfEhCeztujwV0pnuSIp-_NZONbaG8F_8",
  authDomain: "kasirpro-b8b49.firebaseapp.com",
  projectId: "kasirpro-b8b49",
  storageBucket: "kasirpro-b8b49.firebasestorage.app",
  messagingSenderId: "944252896376",
  appId: "1:944252896376:web:d6631865d6ef9b339b598d",
  measurementId: "G-7V6QRHCQGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
