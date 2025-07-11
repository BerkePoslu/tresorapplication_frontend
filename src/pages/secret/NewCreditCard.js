import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { postSecret } from "../../comunication/FetchSecrets";
import "../../css/secrets.css";

/**
 * NewCreditCard
 * @author Peter Rutschmann
 */
function NewCreditCard() {
  const { getAuthHeadersWithContentType } = useAuth();
  const initialState = {
    kindid: 2,
    kind: "creditcard",
    cardtype: "",
    cardnumber: "",
    expiration: "",
    cvv: "",
  };
  const [creditCardValues, setCreditCardValues] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const content = creditCardValues;
      const authHeadersWithContentType = getAuthHeadersWithContentType();
      await postSecret({ content, authHeadersWithContentType });
      setCreditCardValues(initialState);
      navigate("/secret/secrets");
    } catch (error) {
      console.error("Failed to fetch to server:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="secrets-container">
      <h2 className="secrets-header">Add New Credit Card</h2>
      <form onSubmit={handleSubmit} className="secret-form">
        <div className="form-group">
          <label>Card Type:</label>
          <select
            value={creditCardValues.cardtype}
            onChange={(e) =>
              setCreditCardValues((prevValues) => ({
                ...prevValues,
                cardtype: e.target.value,
              }))
            }
            required
            className="form-select"
          >
            <option value="" disabled>
              Select card type
            </option>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
          </select>
        </div>
        <div className="form-group">
          <label>Card Number:</label>
          <input
            type="text"
            value={creditCardValues.cardnumber}
            onChange={(e) =>
              setCreditCardValues((prevValues) => ({
                ...prevValues,
                cardnumber: e.target.value,
              }))
            }
            required
            placeholder="Enter card number"
            pattern="[0-9]{13,19}"
            maxLength="19"
          />
        </div>
        <div className="form-group">
          <label>Expiration Date (MM/YY):</label>
          <input
            type="text"
            value={creditCardValues.expiration}
            onChange={(e) =>
              setCreditCardValues((prevValues) => ({
                ...prevValues,
                expiration: e.target.value,
              }))
            }
            required
            placeholder="MM/YY"
            pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
            maxLength="5"
          />
        </div>
        <div className="form-group">
          <label>CVV:</label>
          <input
            type="text"
            value={creditCardValues.cvv}
            onChange={(e) =>
              setCreditCardValues((prevValues) => ({
                ...prevValues,
                cvv: e.target.value,
              }))
            }
            required
            placeholder="Enter CVV"
            pattern="[0-9]{3,4}"
            maxLength="4"
          />
        </div>
        <button type="submit" className="secret-button">
          Save Credit Card
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
}

export default NewCreditCard;
