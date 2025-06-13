import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, PersonOutline as PersonOutlineIcon, LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import backgroundImage from '../assets/bg.jpg'; // Import the local image

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

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

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register({ name: formData.name, email: formData.email, password: formData.password });
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Box
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        sx={{
          height: 'auto', // Adjust height to content
        }}
      >
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#333' }}>
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            placeholder="Enter your Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
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
            id="email"
            placeholder="Enter Username or Email"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            placeholder="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
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
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    sx={{ color: '#888' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              backgroundColor: '#FF6767',
              '&:hover': { backgroundColor: '#E55353' },
              borderRadius: '8px',
              boxShadow: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: '#777' }}>
            Already have an account? <Link to="/login" style={{ textDecoration: 'none', color: '#3B82F6', fontWeight: 600 }}>Sign In</Link>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Register; 