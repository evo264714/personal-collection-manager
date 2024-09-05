import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, monitorAuthState } from "../firebase";
import axios from "../api/axios";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        fetchUserRole(user, token);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    monitorAuthState();

    return unsubscribe;
  }, []);

  const fetchUserRole = async (user, token) => {
    try {
      const response = await axios.get(`/api/users/${user.uid}`);
      const role = response.data.role;
      setCurrentUser({ ...user, role, token });
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;
      await axios.post("/api/auth/register", { uid, email });
      return userCredential;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const token = await auth.currentUser.getIdToken();

      const response = await axios.post(
        "/api/auth/login",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { user } = response.data;
      setCurrentUser({ ...user, token });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Blocked",
          text: "You have been blocked by the admins.",
        }).then(() => {
          logout();
        });
      } else {
        Swal.fire("Error", "Failed to log in. Please try again.", "error");
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth); // Wait for signOut to complete
      setCurrentUser(null); // Clear current user state
      localStorage.removeItem("currentUser"); // Remove user from local storage
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Failed to sign out:", error);
      Swal.fire("Error", "Failed to sign out. Please try again.", "error");
    }
  };
  
  const value = {
    currentUser,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

