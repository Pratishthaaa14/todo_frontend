import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
        p: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          border: '1px solid #d8b4fe',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: '6rem', color: '#a855f7', mb: 2 }} />
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: '#5b21b6', mb: 1 }}>
          404 - Page Not Found
        </Typography>
        <Typography variant="h6" sx={{ color: '#7e22ce', mb: 3 }}>
          Oops! The page you're looking for has ventured into the unknown.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          It seems the page you were trying to reach doesn't exist or may have been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(user ? '/dashboard' : '/login')}
          sx={{
            bgcolor: '#7c3aed',
            color: 'white',
            fontWeight: 600,
            borderRadius: '9999px',
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              bgcolor: '#6d28d9',
            },
          }}
        >
          {user ? 'Return to Dashboard' : 'Back to Login'}
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
