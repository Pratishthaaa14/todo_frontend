import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.');
      return;
    }
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await requestPasswordReset(email);
      setMessage('If a user with that email exists, a password reset link has been sent. Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send password reset link.');
      console.error('Password reset request error:', err);
      toast.error(err.message || 'Failed to send password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-gray-50 p-4">
      <Box className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <Typography component="h1" variant="h4" className="text-center text-gray-800 mb-6 font-bold">
          Forgot Password
        </Typography>
        <Typography variant="body2" className="text-center text-gray-600 mb-6">
          Enter your email to receive a password reset link.
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, mb: 2, width: '100%' }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mt: 2, mb: 2, width: '100%' }}>{message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <EmailOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              className="pl-10"
              InputProps={{
                startAdornment: (
                  <EmailOutlinedIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
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
            {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword; 