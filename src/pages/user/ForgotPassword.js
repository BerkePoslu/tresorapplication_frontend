import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../../css/secrets.css";

/**
 * ForgotPassword
 * @author Peter Rutschmann
 */
function ForgotPassword() {
  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const recaptchaValue = recaptchaRef.current.getValue();
    if (!recaptchaValue) {
      setMessage("Please verify that you are not a robot");
      setIsLoading(false);
      return;
    }

    try {
      const protocol = process.env.REACT_APP_API_PROTOCOL || "http";
      const host = process.env.REACT_APP_API_HOST || "localhost";
      const port = process.env.REACT_APP_API_PORT || "8080";
      const path = process.env.REACT_APP_API_PATH || "/api";
      const portPart = port ? `:${port}` : "";
      const API_URL = `${protocol}://${host}${portPart}${path}`;

      const response = await fetch(`${API_URL}/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          recaptchaToken: recaptchaValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + " Redirecting to token page...");
        setIsSuccess(true);
        setEmail("");
        recaptchaRef.current.reset();

        // Redirect to reset password page after 3 seconds
        setTimeout(() => {
          navigate("/user/reset-password");
        }, 3000);
      } else {
        setMessage(data.message || "An error occurred. Please try again.");
        setIsSuccess(false);
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.error("Failed to send reset email:", error);
      setMessage("An error occurred. Please try again.");
      setIsSuccess(false);
      recaptchaRef.current.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="secrets-container">
      <h2 className="secrets-header">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="secret-form">
        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
            disabled={isLoading}
          />
        </div>

        <div className="recaptcha-container">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Leyn2crAAAAAH_Nbp6-drbdYObSSVpI_cQu4Dk8"
          />
        </div>

        <button type="submit" className="secret-button" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Email"}
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
          >
            Back to Login
          </button>
          <span className="link-separator">|</span>
          <button
            type="button"
            onClick={() => navigate("/user/reset-password")}
            className="link-button"
          >
            Enter Token
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
