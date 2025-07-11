import React, { createContext, useContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "SET_2FA_REQUIRED":
      return {
        ...state,
        twoFactorRequired: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  twoFactorRequired: false,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing token on mount
    const token = Cookies.get("auth_token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          // Token is valid, fetch user info
          fetchUserInfo(token);
        } else {
          // Token expired, clear it
          Cookies.remove("auth_token");
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("auth_token");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch({
          type: "LOGIN",
          payload: {
            user: userData,
            token: token,
          },
        });
      } else {
        // Invalid token response
        Cookies.remove("auth_token");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      Cookies.remove("auth_token");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresTwoFactor) {
          dispatch({ type: "SET_2FA_REQUIRED", payload: true });
          dispatch({ type: "SET_LOADING", payload: false });
          return { requiresTwoFactor: true };
        } else {
          // Store token in cookie
          Cookies.set("auth_token", data.token, { expires: 1 }); // 1 day

          dispatch({
            type: "LOGIN",
            payload: {
              user: data,
              token: data.token,
            },
          });

          return { success: true };
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
        return { error: data.message || "Login failed" };
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { error: "Network error occurred" };
    }
  };

  const loginWith2FA = async (credentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in cookie
        Cookies.set("auth_token", data.token, { expires: 1 }); // 1 day

        dispatch({
          type: "LOGIN",
          payload: {
            user: data,
            token: data.token,
          },
        });
        dispatch({ type: "SET_2FA_REQUIRED", payload: false });

        return { success: true };
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
        return { error: data.message || "Login failed" };
      }
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      return { error: "Network error occurred" };
    }
  };

  const logout = () => {
    Cookies.remove("auth_token");
    dispatch({ type: "LOGOUT" });
  };

  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { error: data.message || "Registration failed" };
      }
    } catch (error) {
      return { error: "Network error occurred" };
    }
  };

  const setup2FA = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data };
      } else {
        return { error: data.message || "2FA setup failed" };
      }
    } catch (error) {
      return { error: "Network error occurred" };
    }
  };

  const verify2FA = async (code) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/2fa/verify",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: parseInt(code) }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update user state
        dispatch({
          type: "SET_USER",
          payload: {
            ...state.user,
            twoFactorEnabled: true,
          },
        });
        return { success: true };
      } else {
        return { error: data.message || "2FA verification failed" };
      }
    } catch (error) {
      return { error: "Network error occurred" };
    }
  };

  const disable2FA = async (code) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/2fa/disable",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: parseInt(code) }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update user state
        dispatch({
          type: "SET_USER",
          payload: {
            ...state.user,
            twoFactorEnabled: false,
          },
        });
        return { success: true };
      } else {
        return { error: data.message || "2FA disable failed" };
      }
    } catch (error) {
      return { error: "Network error occurred" };
    }
  };

  const getAuthHeaders = () => {
    if (state.token) {
      return {
        Authorization: `Bearer ${state.token}`,
      };
    }
    return {};
  };

  const getAuthHeadersWithContentType = () => {
    if (state.token) {
      return {
        Authorization: `Bearer ${state.token}`,
        "Content-Type": "application/json",
      };
    }
    return {
      "Content-Type": "application/json",
    };
  };

  const value = {
    ...state,
    login,
    loginWith2FA,
    logout,
    register,
    setup2FA,
    verify2FA,
    disable2FA,
    getAuthHeaders,
    getAuthHeadersWithContentType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
