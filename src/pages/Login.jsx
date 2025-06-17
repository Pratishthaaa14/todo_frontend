import { useState, useEffect } from 'react';
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
      toast.error('Invalid credentials. Please check your email and password.');
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
              placeholder="Enter Email"
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
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                sx={{ color: '#6B7280' }}
              />
              <Link to="/forgot-password" className="text-[#FF6767] hover:text-[#ff5252] text-sm transition duration-150 ease-in-out">
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
                backgroundColor: '#FF6767',
                '&:hover': {
                  backgroundColor: '#ff5252',
                },
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Don't have an account?{' '}
                <Link to="/register" className="text-[#FF6767] hover:text-[#ff5252] transition duration-150 ease-in-out">
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