import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function LoginUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWith2FA, isAuthenticated, twoFactorRequired, loading } =
    useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    twoFactorCode: "",
  });
  const [error, setError] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Handle 2FA requirement
  useEffect(() => {
    setShowTwoFactor(twoFactorRequired);
  }, [twoFactorRequired]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (showTwoFactor) {
      // Login with 2FA code
      if (!formData.twoFactorCode) {
        setError("Please enter your 2FA code");
        return;
      }

      const result = await loginWith2FA({
        email: formData.email,
        password: formData.password,
        twoFactorCode: parseInt(formData.twoFactorCode),
      });

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } else {
      // Initial login
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.requiresTwoFactor) {
        setShowTwoFactor(true);
      } else if (result.success) {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    }
  };

  const handleOAuthLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const resetForm = () => {
    setShowTwoFactor(false);
    setFormData({
      email: "",
      password: "",
      twoFactorCode: "",
    });
    setError("");
  };

  if (loading) {
    return <div>Logging in...</div>;
  }

  return (
    <div className="login-container">
      <h2>{showTwoFactor ? "Two-Factor Authentication" : "Login"}</h2>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <section>
          <aside>
            {!showTwoFactor && (
              <>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Please enter your email *"
                  />
                </div>
                <div>
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Please enter your password *"
                  />
                </div>
              </>
            )}

            {showTwoFactor && (
              <div>
                <p>Enter the 6-digit code from your authenticator app:</p>
                <div>
                  <label>2FA Code:</label>
                  <input
                    type="text"
                    name="twoFactorCode"
                    value={formData.twoFactorCode}
                    onChange={handleChange}
                    required
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    pattern="[0-9]{6}"
                  />
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="link-button"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </aside>
        </section>

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : showTwoFactor
            ? "Verify & Login"
            : "Login"}
        </button>

        {!showTwoFactor && (
          <div className="form-links">
            <button
              type="button"
              onClick={() => navigate("/user/forgot-password")}
              className="link-button"
            >
              Forgot Password?
            </button>

            <button
              type="button"
              onClick={() => navigate("/user/register")}
              className="link-button"
            >
              Don't have an account? Register
            </button>

            <div className="oauth-section" style={{ marginTop: "1rem" }}>
              <p>Or</p>
              <button
                type="button"
                onClick={handleOAuthLogin}
                className="oauth-btn"
                style={{
                  backgroundColor: "#4285f4",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Continue with Google
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginUser;
