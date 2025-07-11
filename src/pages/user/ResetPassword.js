import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import "../../css/secrets.css";

/**
 * ResetPassword
 * @author Peter Rutschmann
 */
function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenSource, setTokenSource] = useState("url"); // "url" or "manual"

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setFormData((prev) => ({ ...prev, token: urlToken }));
      setTokenSource("url");
    } else {
      setTokenSource("manual");
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any error messages when user starts typing
    if (message && !isSuccess) {
      setMessage("");
    }
  };

  const validateForm = () => {
    if (!formData.token.trim()) {
      setMessage("Reset token is required.");
      return false;
    }

    if (formData.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const protocol = process.env.REACT_APP_API_PROTOCOL || "http";
      const host = process.env.REACT_APP_API_HOST || "localhost";
      const port = process.env.REACT_APP_API_PORT || "8080";
      const path = process.env.REACT_APP_API_PATH || "/api";
      const portPart = port ? `:${port}` : "";
      const API_URL = `${protocol}://${host}${portPart}${path}`;

      const response = await fetch(`${API_URL}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: formData.token.trim(),
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        setIsSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/user/login");
        }, 3000);
      } else {
        setMessage(data.message || "An error occurred. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Failed to reset password:", error);
      setMessage("An error occurred. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="secrets-container">
      <h2 className="secrets-header">Reset Password</h2>
      <form onSubmit={handleSubmit} className="secret-form">
        <div className="form-group">
          <label>Reset Token:</label>
          <input
            type="text"
            name="token"
            value={formData.token}
            onChange={handleInputChange}
            required
            placeholder="Paste your reset token here (e.g., b43f15d0-e6d4-4fd9-82b3-0720ae182f62)"
            disabled={isLoading || (tokenSource === "url" && formData.token)}
            className={
              tokenSource === "url" && formData.token ? "readonly-input" : ""
            }
          />
          {tokenSource === "url" && formData.token && (
            <small className="form-helper-text">Token loaded from URL</small>
          )}
        </div>

        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
            placeholder="Enter your new password"
            minLength="8"
            disabled={isLoading}
          />
          <PasswordStrengthMeter
            password={formData.newPassword}
            showMeter={formData.newPassword.length > 0}
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            placeholder="Confirm your new password"
            minLength="8"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="secret-button"
          disabled={isLoading || isSuccess}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <div
            className={`message ${
              isSuccess ? "success-message" : "error-message"
            }`}
          >
            {message}
          </div>
        )}

        <div className="form-links">
          <button
            type="button"
            onClick={() => navigate("/user/login")}
            className="link-button"
            disabled={isLoading}
          >
            Back to Login
          </button>
          <span className="link-separator">|</span>
          <button
            type="button"
            onClick={() => navigate("/user/forgot-password")}
            className="link-button"
            disabled={isLoading}
          >
            Request New Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
