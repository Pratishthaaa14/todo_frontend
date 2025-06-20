import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';
import { Button, TextField, Typography, Paper, Box } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Sending forgot password request for email:', email);
      const response = await api.post('api/v1/auth/forgot-password', { email });
      console.log('Forgot password response:', response);
      
      toast.success(response.data.message || 'A password reset link has been sent. Please check your email.');
      // Add a small delay before redirecting to ensure the toast is visible
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Could not send the reset link. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1, textAlign: 'center' }}>
          Forgot Password?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
          No worries! Enter your email to get a reset link.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'secondary.light',
                borderRadius: 2,
                '&:before, &:after': {
                  borderBottom: 'none',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'primary.dark',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            {loading ? <LoadingSpinner size={24} /> : 'Send Reset Link'}
          </Button>
          <Button
            fullWidth
            onClick={() => navigate('/login')}
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword; 