import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import "./css/mvp.css";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Users from "./pages/user/Users";
import LoginUser from "./pages/user/LoginUser";
import RegisterUser from "./pages/user/RegisterUser";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import Secrets from "./pages/secret/Secrets";
import NewCredential from "./pages/secret/NewCredential";
import NewCreditCard from "./pages/secret/NewCreditCard";
import NewNote from "./pages/secret/NewNote";
import TwoFactorAuth from "./pages/user/TwoFactorAuth";
import OAuthCallback from "./pages/user/OAuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * App
 * @author Peter Rutschmann
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/user/login" element={<LoginUser />} />
            <Route path="/user/register" element={<RegisterUser />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route path="/user/reset-password" element={<ResetPassword />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/user/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/2fa"
              element={
                <ProtectedRoute>
                  <TwoFactorAuth />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secret/secrets"
              element={
                <ProtectedRoute>
                  <Secrets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secret/newcredential"
              element={
                <ProtectedRoute>
                  <NewCredential />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secret/newcreditcard"
              element={
                <ProtectedRoute>
                  <NewCreditCard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secret/newnote"
              element={
                <ProtectedRoute>
                  <NewNote />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
