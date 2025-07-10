// src/components/auth/login/index.jsx
import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doPasswordReset } from "@/firebase/auth";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("L'email et le mot de passe sont requis.");
      setIsSigningIn(false);
      return;
    }
    setIsSigningIn(true);
    try {
      await doSignInWithEmailAndPassword(email, password);
    } catch (err) {
      let message = err.message;
      if (err.code === "auth/wrong-password") {
        message = "Mot de passe incorrect.";
      } else if (err.code === "auth/user-not-found") {
        message = "Aucun compte trouvé avec cet email.";
      } else if (err.code === "auth/invalid-email") {
        message = "Format d'email invalide.";
      }
      setErrorMessage(message);
      setIsSigningIn(false);
    }
  };

  const onGoogleLogin = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      await doSignInWithGoogle();
    } catch (err) {
      setErrorMessage(err.message);
      setIsSigningIn(false);
    }
  };

  const onPasswordReset = async () => {
    if (!email) {
      setErrorMessage("Veuillez entrer votre email pour réinitialiser votre mot de passe.");
      return;
    }
    try {
      await doPasswordReset(email);
      alert("Email de réinitialisation envoyé. Vérifiez votre boîte de réception.");
    } catch (err) {
      let message = err.message;
      if (err.code === "auth/invalid-email") {
        message = "Format d'email invalide.";
      } else if (err.code === "auth/user-not-found") {
        message = "Aucun compte trouvé avec cet email.";
      }
      setErrorMessage(message);
    }
  };

  if (userLoggedIn) return <Navigate to="/home" replace />;

  return (
    <main className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 p-6 space-y-6 bg-white shadow-xl border rounded-xl">
        <h3 className="text-2xl font-semibold text-center text-gray-800">Bienvenue</h3>
        <form onSubmit={onSubmit} className="space-y-4">
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
          {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full bg-[var(--lingomate-orange)] text-white py-2 rounded-md hover:bg-[#d6642e] transition-colors disabled:bg-[#f4a680]"
          >
            {isSigningIn ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <div className="text-center text-gray-600">OU</div>
        <button
          onClick={onGoogleLogin}
          disabled={isSigningIn}
          className="w-full border py-2 rounded-md flex justify-center items-center gap-x-2 hover:bg-gray-50 transition-colors disabled:bg-gray-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          {isSigningIn ? "Connexion..." : "Continuer avec Google"}
        </button>
        <p className="text-sm text-center text-gray-600">
          Mot de passe oublié ?{" "}
          <button
            onClick={onPasswordReset}
            className="font-bold text-[var(--lingomate-blue)] underline hover:text-[#0a6b80] transition-colors"
          >
            Réinitialiser
          </button>
        </p>
        <p className="text-sm text-center text-gray-600">
          Pas de compte ?{" "}
          <Link to="/register" className="font-bold text-[var(--lingomate-blue)] underline hover:text-[rgb(10,107,128)] transition-colors">
            S'inscrire
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;