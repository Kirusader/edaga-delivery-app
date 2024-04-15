/** @format */

import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  FacebookAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAW7klEYLW2u0if4s7RVEDrTvtgDGPvohw",
  authDomain: "edaga-delivery.firebaseapp.com",
  projectId: "edaga-delivery",
  storageBucket: "edaga-delivery.appspot.com",
  messagingSenderId: "1072415213231",
  appId: "1:1072415213231:web:e5382730ed138dcbf0b65a",
};
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Firebase services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const signInWithFacebook = async (lat, lng) => {
  const res = await signInWithPopup(auth, facebookProvider);
  const user = res.user;
  console.log(user);
  const q = await getDocs(
    query(collection(db, "users"), where("uid", "==", user.uid))
  );
  try {
    const credential = FacebookAuthProvider.credentialFromResult(res);
    const accessToken = credential.accessToken;
    if (q.docs.length < 1) {
      // Add user to Firestore if not already exists
      const newUserRef = await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        location: [lat, lng],
        rider: false,
        date: new Date(),
      });
      console.log(
        "User does not exists in Firestore. New user added with ID: ",
        newUserRef.id
      );
    } else {
      console.log("User already exists in Firestore. No updates needed.");
    }
  } catch (error) {
    console.error(error);
    console.log(error.message);
  }
};

const signInWithGoogle = async (lat, lng) => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // Check if user exists in Firestore
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length < 1) {
      // Add user to Firestore if not already exists
      const newUserRef = await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        location: [lat, lng],
        rider: false,
        date: new Date(),
      });
      console.log(
        "User does not exists in Firestore. New user added with ID: ",
        newUserRef.id
      );
    } else {
      console.log("User already exists in Firestore. No updates needed.");
    }
    console.log("Popup is successfull. Proceeding...");
  } catch (error) {
    if (error == "FirebaseError: Firebase: Error (auth/popup-closed-by-user).")
      console.log("User closed login popup.");
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (
  name,
  email,
  password,
  lat,
  lng
) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const docs = await getDocs(q);

    if (docs.docs.length < 1) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: name,
        email: email,
        location: [lat, lng],
        rider: false,
        date: new Date(),
      });
      return "Success";
    } else {
      return "User already exists in Firestore";
    }
  } catch (err) {
    console.error(err);
    return err.message;
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent check your email!!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  storage,
  signInWithPopup,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  signInWithFacebook,
};
