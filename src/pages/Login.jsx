import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Container, Alert, IconButton, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, PersonOutline as PersonOutlineIcon, LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import CustomLoader from '../components/ui/CustomLoader';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed. Please double-check your credentials.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-100">
      <Box
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg"
        sx={{
          height: 'auto', // Adjust height to content
        }}
      >
        {/* Left Section: Login Form */}
        <Box sx={{ flex: 1, p: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#2d3748', fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Sign In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="Enter Email"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
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
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Link to="/forgot-password" className="text-[#4299e1] hover:text-[#3182ce] text-sm transition duration-150 ease-in-out">
                Forgot password?
              </Link>
            </Box>
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
              {loading ? <CustomLoader /> : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#4a5568' }}>
                Don't have an account?{' '}
                <Link to="/register" className="text-[#4299e1] hover:text-[#3182ce] transition duration-150 ease-in-out">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Login; 