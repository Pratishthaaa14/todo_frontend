import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, PersonOutline as PersonOutlineIcon, LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

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
      toast.success('Welcome aboard! Your account has been created.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Something went wrong. Please try to register again.');
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-100">
      <Box
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg"
        sx={{
          height: 'auto',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#2d3748', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
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
            variant="filled"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: '#a0aec0' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  backgroundColor: '#edf2f7',
                },
                '&.Mui-focused': {
                  backgroundColor: '#edf2f7',
                  borderColor: '#a0aec0',
                },
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
            variant="filled"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: '#a0aec0' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  backgroundColor: '#edf2f7',
                },
                '&.Mui-focused': {
                  backgroundColor: '#edf2f7',
                  borderColor: '#a0aec0',
                },
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
            variant="filled"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#a0aec0' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                    sx={{ color: '#a0aec0' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  backgroundColor: '#edf2f7',
                },
                '&.Mui-focused': {
                  backgroundColor: '#edf2f7',
                  borderColor: '#a0aec0',
                },
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
            variant="filled"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#a0aec0' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    sx={{ color: '#a0aec0' }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: '#f7fafc',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  backgroundColor: '#edf2f7',
                },
                '&.Mui-focused': {
                  backgroundColor: '#edf2f7',
                  borderColor: '#a0aec0',
                },
              }
            }}
          />
          <FormControlLabel
            control={<Checkbox value="terms" color="primary" sx={{ color: '#a0aec0' }} />}
            label="I agree to the Terms and Conditions"
            sx={{ mt: 2, color: '#4a5568' }}
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
              backgroundColor: '#4299e1',
              '&:hover': {
                backgroundColor: '#3182ce',
              },
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#4a5568' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-[#4299e1] hover:text-[#3182ce] transition duration-150 ease-in-out">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Register; 