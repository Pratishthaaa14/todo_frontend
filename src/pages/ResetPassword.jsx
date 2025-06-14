import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams(); // Get token from URL
  const { confirmPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      await confirmPasswordReset(token, password);
      setMessage('Your password has been reset successfully. You can now log in.');
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-gray-50 p-4">
      <Box className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <Typography component="h1" variant="h4" className="text-center text-gray-800 mb-6 font-bold">
          Reset Password
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, mb: 2, width: '100%' }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mt: 2, mb: 2, width: '100%' }}>{message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <LockOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <TextField
              fullWidth
              id="password"
              label="New Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              className="pl-10"
              InputProps={{
                startAdornment: (
                  <LockOutlinedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                ),
              }}
            />
          </div>
          <div className="relative">
            <LockOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <TextField
              fullWidth
              id="confirmPassword"
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="outlined"
              className="pl-10"
              InputProps={{
                startAdornment: (
                  <LockOutlinedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                ),
              }}
            />
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
          <Typography variant="body2" className="text-center text-gray-600">
            <Link to="/login" className="text-red-500 hover:underline">
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default ResetPassword; 