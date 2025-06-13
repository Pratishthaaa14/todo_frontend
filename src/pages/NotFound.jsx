import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, Container } from '@mui/material';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F8FF]">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
          bgcolor: 'background.paper',
          p: 8,
          borderRadius: '16px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '6rem', fontWeight: 700, color: '#EF4444' }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ color: '#6B7280' }}>
          The page you are looking for doesn't exist.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            sx={{
              bgcolor: '#FF6767',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              padding: '12px 24px',
              '&:hover': {
                bgcolor: '#DC2626',
              },
            }}
          >
            {user ? 'Go to Dashboard' : 'Sign In'}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default NotFound;
