import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postUser } from "../../comunication/FetchUser";
import ReCAPTCHA from "react-google-recaptcha";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import "../../css/secrets.css";

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser() {
  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errorMessage: "",
  };
  const [credentials, setCredentials] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const recaptchaValue = recaptchaRef.current.getValue();
    if (!recaptchaValue) {
      setErrorMessage("Please verify that you are not a robot");
      return;
    }

    if (credentials.password !== credentials.passwordConfirmation) {
      console.log("password != passwordConfirmation");
      setErrorMessage("Password and password confirmation do not match.");
      return;
    }

    try {
      const userDataWithRecaptcha = {
        ...credentials,
        recaptchaToken: recaptchaValue,
      };

      await postUser(userDataWithRecaptcha);
      setCredentials(initialState);
      // After successful registration, redirect to login page
      navigate("/user/login");
    } catch (error) {
      console.error("Failed to fetch to server:", error.message);
      setErrorMessage(error.message);
      recaptchaRef.current.reset();
    }
  };

  return (
    <div className="secrets-container">
      <h2 className="secrets-header">Register User</h2>
      <form onSubmit={handleSubmit} className="secret-form">
        <section>
          <aside>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={credentials.firstName}
                onChange={(e) =>
                  setCredentials((prevValues) => ({
                    ...prevValues,
                    firstName: e.target.value,
                  }))
                }
                required
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={credentials.lastName}
                onChange={(e) =>
                  setCredentials((prevValues) => ({
                    ...prevValues,
                    lastName: e.target.value,
                  }))
                }
                required
                placeholder="Enter your last name"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials((prevValues) => ({
                    ...prevValues,
                    email: e.target.value,
                  }))
                }
                required
                placeholder="Enter your email address"
              />
            </div>
          </aside>
          <aside>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prevValues) => ({
                    ...prevValues,
                    password: e.target.value,
                  }))
                }
                required
                placeholder="Create a strong password"
                minLength="8"
              />
              <PasswordStrengthMeter
                password={credentials.password}
                showMeter={credentials.password.length > 0}
              />
            </div>
            <div className="form-group">
              <label>Password Confirmation:</label>
              <input
                type="password"
                value={credentials.passwordConfirmation}
                onChange={(e) =>
                  setCredentials((prevValues) => ({
                    ...prevValues,
                    passwordConfirmation: e.target.value,
                  }))
                }
                required
                placeholder="Confirm your password"
                minLength="8"
              />
            </div>
          </aside>
        </section>
        <div className="recaptcha-container">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Leyn2crAAAAAH_Nbp6-drbdYObSSVpI_cQu4Dk8"
            onChange={() => setErrorMessage("")}
          />
        </div>
        <button type="submit" className="secret-button">
          Register
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
}

export default RegisterUser;
