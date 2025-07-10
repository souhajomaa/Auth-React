//src/components/header/index.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { doSignOut } from "@/firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <nav className="flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-[var(--lingomate-blue)]">
      {userLoggedIn ? (
        <button
          onClick={() => {
            setIsSigningOut(true);
            doSignOut()
              .then(() => navigate("/login"))
              .catch((err) => alert(err.message))
              .finally(() => setIsSigningOut(false));
          }}
          disabled={isSigningOut}
          className="text-sm text-white underline hover:text-gray-200 transition-colors"
        >
          {isSigningOut ? "Déconnexion..." : "Déconnexion"}
        </button>
      ) : (
        <>
          <Link className="text-sm text-white underline hover:text-gray-200 transition-colors" to="/login">
            Connexion
          </Link>
          <Link className="text-sm text-white underline hover:text-gray-200 transition-colors" to="/register">
            Créer un compte
          </Link>
        </>
      )}
    </nav>
  );
};

export default Header;