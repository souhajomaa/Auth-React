import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import Home from "@/components/home";
import Header from "@/components/header";

function App() {
  const { userLoggedIn, currentUser } = useAuth();
  console.log("App - userLoggedIn:", userLoggedIn, "currentUser:", currentUser);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Routes>
        <Route
          path="/"
          element={userLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!userLoggedIn ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!userLoggedIn ? <Register /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;