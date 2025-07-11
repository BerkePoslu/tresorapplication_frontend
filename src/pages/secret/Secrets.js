import "../../App.css";
import "../../css/secrets.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getSecretsforUser } from "../../comunication/FetchSecrets";

/**
 * Secrets
 * @author Peter Rutschmann
 */
const Secrets = () => {
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  const [secrets, setSecrets] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSecrets = async () => {
      setErrorMessage("");
      if (!isAuthenticated || !user?.email) {
        console.error("Secrets: No valid email, please do login first:" + user);
        setErrorMessage("No valid email, please do login first.");
      } else {
        try {
          const authHeaders = getAuthHeaders();
          const data = await getSecretsforUser(authHeaders);
          console.log(data);
          setSecrets(data);
        } catch (error) {
          console.error("Failed to fetch to server:", error.message);
          setErrorMessage(error.message);
        }
      }
    };
    fetchSecrets();
  }, [user, isAuthenticated, getAuthHeaders]);

  const formatSecretContent = (secret) => {
    const content = secret.content;

    switch (content.kind) {
      case "credential":
        return (
          <div className="secret-content credential">
            <div className="secret-icon">🔑</div>
            <div className="secret-details">
              <div className="secret-row">
                <span className="secret-label">Username</span>
                <span className="secret-value">{content.userName}</span>
              </div>
              <div className="secret-row">
                <span className="secret-label">Password</span>
                <span className="secret-value">••••••••</span>
              </div>
              <div className="secret-row">
                <span className="secret-label">URL</span>
                <span className="secret-value">
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content.url}
                  </a>
                </span>
              </div>
            </div>
          </div>
        );

      case "creditcard":
        return (
          <div className="secret-content creditcard">
            <div className="secret-icon">💳</div>
            <div className="secret-details">
              <div className="secret-row">
                <span className="secret-label">Card Type</span>
                <span className="secret-value">{content.cardtype}</span>
              </div>
              <div className="secret-row">
                <span className="secret-label">Card Number</span>
                <span className="secret-value">
                  •••• •••• •••• {content.cardnumber.slice(-4)}
                </span>
              </div>
              <div className="secret-row">
                <span className="secret-label">Expiration</span>
                <span className="secret-value">{content.expiration}</span>
              </div>
              <div className="secret-row">
                <span className="secret-label">CVV</span>
                <span className="secret-value">•••</span>
              </div>
            </div>
          </div>
        );

      case "note":
        return (
          <div className="secret-content note">
            <div className="secret-icon">📝</div>
            <div className="secret-details">
              <div className="secret-row">
                <span className="secret-label">Title</span>
                <span className="secret-value">{content.title}</span>
              </div>
              <div className="secret-row">
                <span className="secret-label">Content</span>
                <span className="secret-value content-text">
                  {content.content}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return <pre>{JSON.stringify(content, null, 2)}</pre>;
    }
  };

  return (
    <div className="secrets-container">
      <h1 className="secrets-header">My Secrets</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {secrets?.length > 0 ? (
        <div className="secrets-grid">
          {secrets.map((secret) => (
            <div key={secret.id} className="secret-card">
              <div className="secret-header">
                <span className="secret-id">#{secret.id}</span>
                <span className="secret-type">{secret.content.kind}</span>
              </div>
              {formatSecretContent(secret)}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-secrets-message">
          No secrets available. Create your first secret by clicking on "new
          credential", "new credit-card", or "new note" in the navigation menu.
        </div>
      )}
    </div>
  );
};

export default Secrets;
