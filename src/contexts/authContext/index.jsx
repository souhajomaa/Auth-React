//src/contexts/authContext/index.jsx
import React, { useContext, useState, useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider - Initializing auth:", auth);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        console.log("AuthProvider - onAuthStateChanged:", user);
        if (user) {
          setCurrentUser(user);
          setUserLoggedIn(true);
        } else {
          setCurrentUser(null);
          setUserLoggedIn(false);
        }
        setLoading(false);
      } catch (error) {
        console.error("Auth error:", error.message);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    userLoggedIn,
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-700 text-xl font-semibold">Chargement...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}