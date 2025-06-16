import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const { login, isAuthenticated } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending reset password request for token:', resetToken);
      const response = await api.post(`api/v1/auth/reset-password/${resetToken}`, { 
        password,
        confirmPassword 
      });
      console.log('Reset password response:', response);
      
      if (response.data.success) {
        toast.success(response.data.message || 'Password has been reset successfully');
        
        // Use the token and user data from the reset password response
        if (response.data.token && response.data.user) {
          console.log('Logging in with reset password response data');
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          // Call login with the user data
          await login({ email: response.data.user.email, password });
          console.log('Login successful, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('No token/user data in response, attempting login with new password');
          // If no token/user data, try to log in with the new password
          try {
            const loginResponse = await api.post('api/v1/auth/login', {
              email: response.data.user.email,
              password: password // Use the new password
            });

            if (loginResponse.data.success) {
              console.log('Login successful with new password');
              await login({ email: response.data.user.email, password });
              console.log('Login successful, redirecting to dashboard');
              navigate('/dashboard', { replace: true });
            } else {
              console.log('Login failed, redirecting to login page');
              toast.error('Please log in with your new password');
              navigate('/login', { replace: true });
            }
          } catch (loginError) {
            console.error('Auto-login error:', loginError);
            toast.error('Password reset successful. Please log in with your new password.');
            navigate('/login', { replace: true });
          }
        }
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password below
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6767] focus:border-[#FF6767] focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6767] hover:bg-[#ff5252] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6767] transition duration-150 ease-in-out transform hover:scale-[1.02]"
            >
              {loading ? (
                <LoadingSpinner text="Resetting..." />
              ) : (
                'Reset Password'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-[#FF6767] hover:text-[#ff5252] transition duration-150 ease-in-out"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 