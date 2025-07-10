// src/firebase/auth.js
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// ➤ Créer un compte utilisateur + l’enregistrer dans Firestore
export const doCreateUserWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      provider: "password",
      createdAt: new Date(),
    });
    return userCredential;
  } catch (error) {
    throw new Error(error.message);
  }
};

// ➤ Connexion avec email / mot de passe
export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

// ➤ Connexion avec Google + ajout Firestore si nouveau
export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        provider: "google",
        createdAt: new Date(),
      },
      { merge: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// ➤ Déconnexion
export const doSignOut = () => {
  return auth.signOut();
};

// ➤ Réinitialisation mot de passe
export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// ➤ Changement de mot de passe
export const doPasswordChange = async (password) => {
  if (!auth.currentUser) throw new Error("No user logged in.");
  try {
    return await updatePassword(auth.currentUser, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

// ➤ Vérification de l'email
export const doSendEmailVerification = async () => {
  if (!auth.currentUser) throw new Error("No user logged in.");
  try {
    return await sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};