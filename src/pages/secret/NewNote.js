import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { postSecret } from "../../comunication/FetchSecrets";
import "../../css/secrets.css";

/**
 * NewNote
 * @author Peter Rutschmann
 */
function NewNote() {
  const { getAuthHeadersWithContentType } = useAuth();
  const initialState = {
    kindid: 3,
    kind: "note",
    title: "",
    content: "",
  };
  const [noteValues, setNoteValues] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const content = noteValues;
      const authHeadersWithContentType = getAuthHeadersWithContentType();
      await postSecret({ content, authHeadersWithContentType });
      setNoteValues(initialState);
      navigate("/secret/secrets");
    } catch (error) {
      console.error("Failed to fetch to server:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="secrets-container">
      <h2 className="secrets-header">Add New Note</h2>
      <form onSubmit={handleSubmit} className="secret-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={noteValues.title}
            onChange={(e) =>
              setNoteValues((prevValues) => ({
                ...prevValues,
                title: e.target.value,
              }))
            }
            required
            placeholder="Enter note title"
          />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={noteValues.content}
            onChange={(e) =>
              setNoteValues((prevValues) => ({
                ...prevValues,
                content: e.target.value,
              }))
            }
            required
            placeholder="Enter note content"
            rows={6}
          />
        </div>
        <button type="submit" className="secret-button">
          Save Note
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
}

export default NewNote;
