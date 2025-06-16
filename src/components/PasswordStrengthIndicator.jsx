import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters
    
    return Math.min(strength, 5);
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return 'danger';
      case 2:
      case 3:
        return 'warning';
      case 4:
        return 'info';
      case 5:
        return 'success';
      default:
        return 'danger';
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return 'Very Weak';
    }
  };

  const strength = calculateStrength(password);
  const color = getStrengthColor(strength);
  const text = getStrengthText(strength);

  return (
    <div className="mt-2">
      <ProgressBar
        now={(strength / 5) * 100}
        variant={color}
        className="mb-1"
        style={{ height: '5px' }}
      />
      <small className={`text-${color}`}>
        Password Strength: {text}
      </small>
      {password && (
        <div className="mt-2">
          <small className="text-muted">
            Password must contain:
            <ul className="mb-0 ps-3">
              <li className={password.length >= 8 ? 'text-success' : 'text-danger'}>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(password) ? 'text-success' : 'text-danger'}>
                At least one uppercase letter
              </li>
              <li className={/[a-z]/.test(password) ? 'text-success' : 'text-danger'}>
                At least one lowercase letter
              </li>
              <li className={/[0-9]/.test(password) ? 'text-success' : 'text-danger'}>
                At least one number
              </li>
              <li className={/[^A-Za-z0-9]/.test(password) ? 'text-success' : 'text-danger'}>
                At least one special character
              </li>
            </ul>
          </small>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator; 