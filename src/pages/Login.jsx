import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Container, Alert, IconButton, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, PersonOutline as PersonOutlineIcon, LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import backgroundImage from '../assets/bg.jpg'; // Import the local image

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await login({ email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 md:p-12" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Box
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm md:max-w-md lg:max-w-lg"
        sx={{
          height: 'auto', // Adjust height to content
        }}
      >
        {/* Left Section: Login Form */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#333', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="Enter Username"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB !important' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB !important' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6B7280 !important' },
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="Enter Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: '#888' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB !important' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB !important' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6B7280 !important' },
                }
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember Me"
              sx={{ mt: 1, mb: 2, '& .MuiFormControlLabel-label': { fontSize: { xs: '0.8rem', sm: '0.9rem' } } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                backgroundColor: '#FF6767',
                '&:hover': { backgroundColor: '#E55353' },
                borderRadius: '8px',
                boxShadow: 'none',
                fontWeight: 'bold',
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Login'}
            </Button>
            
            <Typography variant="body2" align="center" sx={{ color: '#777', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              Don't have an account? <Link to="/register" style={{ textDecoration: 'none', color: '#3B82F6', fontWeight: 600 }}>Create One</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Login; 