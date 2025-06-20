import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Typography, Paper, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const { login, isAuthenticated, user } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, user });
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setLoading(false);
      toast.error("Heads up! The passwords don't match.");
      return;
    }

    if (password.length < 6) {
      setLoading(false);
      toast.error('Password should be at least 6 characters long.');
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
        toast.success(response.data.message || 'Great! Your password has been reset.');
        
        // Use the token and user data from the reset password response
        if (response.data.token && response.data.user) {
          console.log('Logging in with reset password response data');
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          // Call login with the user data
          try {
            await login({ 
              email: response.data.user.email, 
              password: password 
            });
            console.log('Login successful, checking auth state');
            // Wait a bit for the auth state to update
            setTimeout(() => {
              console.log('Current auth state:', { isAuthenticated, user });
              if (isAuthenticated && user) {
                console.log('Navigating to dashboard');
                navigate('/dashboard', { replace: true });
              } else {
                console.log('Auth state not updated, redirecting to login');
                navigate('/login', { replace: true });
              }
            }, 1000);
          } catch (loginError) {
            console.error('Login error:', loginError);
            toast.error('Password reset! Please log in with your new password to continue.');
            navigate('/login', { replace: true });
          }
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
              await login({ 
                email: response.data.user.email, 
                password: password 
              });
              console.log('Login successful, checking auth state');
              // Wait a bit for the auth state to update
              setTimeout(() => {
                console.log('Current auth state:', { isAuthenticated, user });
                if (isAuthenticated && user) {
                  console.log('Navigating to dashboard');
                  navigate('/dashboard', { replace: true });
                } else {
                  console.log('Auth state not updated, redirecting to login');
                  navigate('/login', { replace: true });
                }
              }, 1000);
            } else {
              console.log('Login failed, redirecting to login page');
              toast.info('Please sign in with your new password.');
              navigate('/login', { replace: true });
            }
          } catch (loginError) {
            console.error('Auto-login error:', loginError);
            toast.info('Password updated. Please log in to continue.');
            navigate('/login', { replace: true });
          }
        }
      } else {
        toast.error(response.data.message || 'Sorry, we couldn\'t reset your password.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

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
          Reset Your Password
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
          Please enter your new password below.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
            {loading ? <LoadingSpinner size={24} /> : 'Reset Password'}
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

export default ResetPassword; 