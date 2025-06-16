import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import api from '../api/axios';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('New password does not meet the strength requirements');
      return;
    }

    setLoading(true);

    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password has been changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password');
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Body className="p-4">
        <h4 className="mb-4 d-flex align-items-center">
          <i className="fas fa-lock me-2 text-primary"></i>
          Change Password
        </h4>
        
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted">Current Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword.current ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="py-2 pe-5"
              />
              <Button
                variant="link"
                className="position-absolute end-0 top-50 translate-middle-y text-muted p-0 me-2"
                onClick={() => togglePasswordVisibility('current')}
                type="button"
              >
                <i className={`fas fa-${showPassword.current ? 'eye-slash' : 'eye'}`}></i>
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-muted">New Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword.new ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="py-2 pe-5"
              />
              <Button
                variant="link"
                className="position-absolute end-0 top-50 translate-middle-y text-muted p-0 me-2"
                onClick={() => togglePasswordVisibility('new')}
                type="button"
              >
                <i className={`fas fa-${showPassword.new ? 'eye-slash' : 'eye'}`}></i>
              </Button>
            </div>
            <PasswordStrengthIndicator password={newPassword} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-muted">Confirm New Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="py-2 pe-5"
              />
              <Button
                variant="link"
                className="position-absolute end-0 top-50 translate-middle-y text-muted p-0 me-2"
                onClick={() => togglePasswordVisibility('confirm')}
                type="button"
              >
                <i className={`fas fa-${showPassword.confirm ? 'eye-slash' : 'eye'}`}></i>
              </Button>
            </div>
          </Form.Group>

          <div className="d-grid">
            <Button
              variant="primary"
              type="submit"
              className="py-2"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner text="Changing..." />
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Change Password
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChangePassword; 