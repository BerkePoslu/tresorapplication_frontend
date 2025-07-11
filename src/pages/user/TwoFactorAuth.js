import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

function TwoFactorAuth() {
  const { user, setup2FA, verify2FA, disable2FA } = useAuth();
  const [step, setStep] = useState("main"); // main, setup, verify, disable
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [step]);

  const handleSetup2FA = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await setup2FA();

      if (result.success) {
        setQrCodeUrl(result.data.qrCodeDataUrl);
        setSecretKey(result.data.secretKey);
        setBackupCodes(result.data.backupCodes);
        setStep("setup");
      } else {
        setError(result.error || "2FA setup failed");
      }
    } catch (error) {
      setError("An error occurred during 2FA setup");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }

    try {
      const result = await verify2FA(verificationCode);

      if (result.success) {
        setSuccess("Two-factor authentication has been enabled successfully!");
        setStep("main");
        setVerificationCode("");
      } else {
        setError(result.error || "2FA verification failed");
      }
    } catch (error) {
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }

    try {
      const result = await disable2FA(verificationCode);

      if (result.success) {
        setSuccess("Two-factor authentication has been disabled successfully!");
        setStep("main");
        setVerificationCode("");
      } else {
        setError(result.error || "2FA disable failed");
      }
    } catch (error) {
      setError("An error occurred while disabling 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(value);
    setError("");
  };

  const renderMainView = () => (
    <div className="two-factor-main">
      <h2>Two-Factor Authentication</h2>

      {success && (
        <div
          className="success-message"
          style={{ color: "green", marginBottom: "1rem" }}
        >
          {success}
        </div>
      )}

      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      <div className="current-status">
        <h3>Current Status</h3>
        <p>
          Two-factor authentication is{" "}
          <strong style={{ color: user?.twoFactorEnabled ? "green" : "red" }}>
            {user?.twoFactorEnabled ? "ENABLED" : "DISABLED"}
          </strong>
        </p>
        {user?.twoFactorEnabled && (
          <p style={{ color: "green" }}>
            🔐 Your account is protected with 2FA
          </p>
        )}
      </div>

      <div className="actions">
        {!user?.twoFactorEnabled ? (
          <div>
            <h3>Enable Two-Factor Authentication</h3>
            <p>
              Add an extra layer of security to your account by enabling
              two-factor authentication. You'll need an authenticator app like
              Google Authenticator or Authy.
            </p>
            <button
              onClick={handleSetup2FA}
              disabled={loading}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Setting up..." : "Enable 2FA"}
            </button>
          </div>
        ) : (
          <div>
            <h3>Manage Two-Factor Authentication</h3>
            <p>
              Two-factor authentication is currently enabled on your account.
            </p>
            <button
              onClick={() => setStep("disable")}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Disable 2FA
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSetupView = () => (
    <div className="two-factor-setup">
      <h2>Set Up Two-Factor Authentication</h2>

      <div className="setup-steps">
        <div className="step">
          <h3>Step 1: Scan QR Code</h3>
          <p>Use your authenticator app to scan this QR code:</p>
          {qrCodeUrl && (
            <div
              className="qr-code-container"
              style={{ textAlign: "center", margin: "20px 0" }}
            >
              <img
                src={qrCodeUrl}
                alt="2FA QR Code"
                style={{ border: "1px solid #ddd", padding: "10px" }}
              />
            </div>
          )}
          <p>
            Or manually enter this secret key: <code>{secretKey}</code>
          </p>
        </div>

        <div className="step">
          <h3>Step 2: Save Backup Codes</h3>
          <p>
            Save these backup codes in a safe place. You can use them to access
            your account if you lose your phone:
          </p>
          <div
            className="backup-codes"
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              border: "1px solid #ddd",
              fontFamily: "monospace",
              margin: "10px 0",
            }}
          >
            {backupCodes.map((code, index) => (
              <div key={index}>{code}</div>
            ))}
          </div>
          <p style={{ color: "red", fontSize: "14px" }}>
            ⚠️ These codes will not be shown again. Please save them now!
          </p>
        </div>

        <div className="step">
          <h3>Step 3: Verify Setup</h3>
          <p>
            Enter the 6-digit code from your authenticator app to complete
            setup:
          </p>
          <form onSubmit={handleVerify2FA}>
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={handleCodeChange}
                placeholder="Enter 6-digit code"
                maxLength="6"
                pattern="[0-9]{6}"
                style={{
                  padding: "10px",
                  fontSize: "18px",
                  textAlign: "center",
                  letterSpacing: "2px",
                  width: "150px",
                }}
                required
              />
            </div>

            {error && (
              <div style={{ color: "red", margin: "10px 0" }}>{error}</div>
            )}

            <div style={{ marginTop: "20px" }}>
              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                {loading ? "Verifying..." : "Verify & Enable"}
              </button>

              <button
                type="button"
                onClick={() => setStep("main")}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderDisableView = () => (
    <div className="two-factor-disable">
      <h2>Disable Two-Factor Authentication</h2>

      <div
        className="warning"
        style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ color: "#856404" }}>⚠️ Warning</h3>
        <p style={{ color: "#856404" }}>
          Disabling two-factor authentication will make your account less
          secure. Are you sure you want to continue?
        </p>
      </div>

      <p>Enter the 6-digit code from your authenticator app to disable 2FA:</p>

      <form onSubmit={handleDisable2FA}>
        <div>
          <input
            type="text"
            value={verificationCode}
            onChange={handleCodeChange}
            placeholder="Enter 6-digit code"
            maxLength="6"
            pattern="[0-9]{6}"
            style={{
              padding: "10px",
              fontSize: "18px",
              textAlign: "center",
              letterSpacing: "2px",
              width: "150px",
            }}
            required
          />
        </div>

        {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            {loading ? "Disabling..." : "Disable 2FA"}
          </button>

          <button
            type="button"
            onClick={() => setStep("main")}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div
      className="two-factor-auth-container"
      style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
    >
      {step === "main" && renderMainView()}
      {step === "setup" && renderSetupView()}
      {step === "disable" && renderDisableView()}
    </div>
  );
}

export default TwoFactorAuth;
