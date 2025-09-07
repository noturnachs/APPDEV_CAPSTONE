import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage or session)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    // This would normally be an API call to your backend
    try {
      // Simulate API call
      const user = { id: 1, email, name: "Test User" };

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw new Error(error.message || "Failed to login");
    }
  };

  // Register function
  const register = async (userData) => {
    // This would normally be an API call to your backend
    try {
      // Simulate API call
      const user = {
        id: 1,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        company: userData.company,
      };

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw new Error(error.message || "Failed to register");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Reset password function
  const resetPassword = async (email) => {
    // This would normally be an API call to your backend
    try {
      // Simulate API call
      return true;
    } catch (error) {
      throw new Error(error.message || "Failed to reset password");
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
