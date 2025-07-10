//src/components/home/index.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";

const Home = () => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return (
    <div className="pt-16 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">LingoMate App</h1>
        <p className="text-gray-600 mb-4">
          Status: Connecté
        </p>
        <p className="text-gray-600 mb-4">
          User: {currentUser.email || "N/A"}
        </p>
        <p className="text-2xl font-bold">
          Hello {currentUser.displayName || currentUser.email}, you are now logged in.
        </p>
      </div>
    </div>
  );
};

export default Home;