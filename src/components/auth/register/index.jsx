// src/components/auth/register/index.jsx
import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle, doSendEmailVerification } from "@/firebase/auth";

const Register = () => {
  const { userLoggedIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password || !name) {
      setErrorMessage("Tous les champs sont requis.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Format d'email invalide.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!name.trim()) {
      setErrorMessage("Le nom est requis.");
      return;
    }
    setIsRegistering(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password, name);
      await doSendEmailVerification();
      alert("Compte créé ! Veuillez vérifier votre email pour activer votre compte.");
    } catch (error) {
      let message = error.message;
      if (error.code === "auth/email-already-in-use") {
        message = "Cet email est déjà utilisé.";
      } else if (error.code === "auth/invalid-email") {
        message = "Format d'email invalide.";
      } else if (error.code === "auth/weak-password") {
        message = "Le mot de passe est trop faible (minimum 6 caractères).";
      }
      setErrorMessage(message);
      setIsRegistering(false);
    }
  };

  const onGoogleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await doSignInWithGoogle();
    } catch (error) {
      setErrorMessage(error.message);
      setIsRegistering(false);
    }
  };

  if (userLoggedIn) return <Navigate to="/home" replace />;

  return (
    <main className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 p-6 space-y-6 bg-white shadow-xl border rounded-xl">
        <h3 className="text-2xl font-semibold text-center text-gray-800">Créer un nouveau compte</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom complet"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--lingomate-orange)] focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--lingomate-orange)] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--lingomate-orange)] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--lingomate-orange)] focus:outline-none"
          />
          {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full bg-[var(--lingomate-orange)] text-white py-2 rounded-md hover:bg-[#d6642e] transition-colors disabled:bg-[#f4a680]"
          >
            {isRegistering ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <div className="text-center text-gray-600">OU</div>
        <button
          onClick={onGoogleRegister}
          disabled={isRegistering}
          className="w-full border py-2 rounded-md flex justify-center items-center gap-x-2 hover:bg-gray-50 transition-colors disabled:bg-gray-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          {isRegistering ? "Connexion..." : "Continuer avec Google"}
        </button>
        <p className="text-sm text-center text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="font-bold text-[var(--lingomate-blue)] underline hover:text-[#0a6b80] transition-colors">
            Connexion
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;