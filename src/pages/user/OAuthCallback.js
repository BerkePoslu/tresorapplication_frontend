import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setTimeout(() => {
            navigate("/user/login?error=oauth_failed");
          }, 3000);
          return;
        }

        if (token) {
          try {
            // Validate the token
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
              // Store the token
              Cookies.set("auth_token", token, { expires: 1 }); // 1 day

              setStatus("success");

              // Redirect to home and let the AuthContext pick up the token
              setTimeout(() => {
                navigate("/", { replace: true });
                // Force a page reload to trigger the AuthContext to check for the new token
                window.location.reload();
              }, 2000);
            } else {
              throw new Error("Token expired");
            }
          } catch (tokenError) {
            console.error("Token validation error:", tokenError);
            setStatus("error");
            setTimeout(() => {
              navigate("/user/login?error=invalid_token");
            }, 3000);
          }
        } else {
          setStatus("error");
          setTimeout(() => {
            navigate("/user/login?error=no_token");
          }, 3000);
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setTimeout(() => {
          navigate("/user/login?error=oauth_failed");
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const renderStatus = () => {
    switch (status) {
      case "processing":
        return (
          <div className="oauth-status processing">
            <div className="spinner">🔄</div>
            <h2>Processing OAuth Login...</h2>
            <p>Please wait while we complete your login.</p>
          </div>
        );

      case "success":
        return (
          <div className="oauth-status success">
            <div className="success-icon">✅</div>
            <h2>Login Successful!</h2>
            <p>You have been successfully logged in with Google.</p>
            <p>Redirecting you to the application...</p>
          </div>
        );

      case "error":
        return (
          <div className="oauth-status error">
            <div className="error-icon">❌</div>
            <h2>Login Failed</h2>
            <p>There was an error processing your OAuth login.</p>
            <p>You will be redirected to the login page shortly.</p>
            <button
              onClick={() => navigate("/user/login")}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Return to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="oauth-callback-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        textAlign: "center",
      }}
    >
      <div
        className="oauth-callback-content"
        style={{
          maxWidth: "400px",
          padding: "40px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {renderStatus()}
      </div>
    </div>
  );
}

export default OAuthCallback;
