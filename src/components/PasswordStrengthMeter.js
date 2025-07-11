import React from "react";
import "../css/password-strength.css";

/**
 * PasswordStrengthMeter
 * @author Peter Rutschmann
 */
const PasswordStrengthMeter = ({ password, showMeter = true }) => {
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, level: "", feedback: [] };

    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    // Determine strength level
    let level = "";
    if (score === 0) level = "";
    else if (score <= 2) level = "weak";
    else if (score <= 3) level = "fair";
    else if (score <= 4) level = "good";
    else level = "strong";

    return { score, level, feedback };
  };

  const strength = calculatePasswordStrength(password);

  if (!showMeter || !password) {
    return null;
  }

  const getStrengthText = () => {
    switch (strength.level) {
      case "weak":
        return "Weak";
      case "fair":
        return "Fair";
      case "good":
        return "Good";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  const getStrengthColor = () => {
    switch (strength.level) {
      case "weak":
        return "#e74c3c";
      case "fair":
        return "#f39c12";
      case "good":
        return "#f1c40f";
      case "strong":
        return "#27ae60";
      default:
        return "#bdc3c7";
    }
  };

  return (
    <div className="password-strength-meter">
      <div className="strength-progress">
        <div
          className={`strength-bar strength-${strength.level}`}
          style={{
            width: `${(strength.score / 5) * 100}%`,
            backgroundColor: getStrengthColor(),
          }}
        ></div>
      </div>

      <div className="strength-info">
        <span
          className={`strength-text strength-${strength.level}`}
          style={{ color: getStrengthColor() }}
        >
          {getStrengthText()}
        </span>

        {strength.feedback.length > 0 && (
          <div className="strength-feedback">
            <span className="feedback-label">Add: </span>
            <span className="feedback-items">
              {strength.feedback.join(", ")}
            </span>
          </div>
        )}
      </div>

      {strength.level === "strong" && (
        <div className="strength-success">
          <span className="success-icon">✓</span>
          <span className="success-text">Great password!</span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
