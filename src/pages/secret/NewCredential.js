import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { postSecret } from "../../comunication/FetchSecrets";
import "../../css/secrets.css";

/**
 * NewCredential
 * @author Peter Rutschmann
 */
function NewCredential() {
  const { getAuthHeadersWithContentType } = useAuth();
  const initialState = {
    kindid: 1,
    kind: "credential",
    userName: "",
    password: "",
    url: "",
  };
  const [credentialValues, setCredentialValues] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const content = credentialValues;
      const authHeadersWithContentType = getAuthHeadersWithContentType();
      await postSecret({ content, authHeadersWithContentType });
      setCredentialValues(initialState);
      navigate("/secret/secrets");
    } catch (error) {
      console.error("Failed to fetch to server:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="secrets-container">
      <h2 className="secrets-header">Add New Credential</h2>
      <form onSubmit={handleSubmit} className="secret-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={credentialValues.userName}
            onChange={(e) =>
              setCredentialValues((prevValues) => ({
                ...prevValues,
                userName: e.target.value,
              }))
            }
            required
            placeholder="Enter username"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={credentialValues.password}
            onChange={(e) =>
              setCredentialValues((prevValues) => ({
                ...prevValues,
                password: e.target.value,
              }))
            }
            required
            placeholder="Enter password"
          />
        </div>
        <div className="form-group">
          <label>URL:</label>
          <input
            type="url"
            value={credentialValues.url}
            onChange={(e) =>
              setCredentialValues((prevValues) => ({
                ...prevValues,
                url: e.target.value,
              }))
            }
            required
            placeholder="Enter website URL"
          />
        </div>
        <button type="submit" className="secret-button">
          Save Credential
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
}

export default NewCredential;
