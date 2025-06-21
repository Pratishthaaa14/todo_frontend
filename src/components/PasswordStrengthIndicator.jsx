import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const PasswordStrengthIndicator = ({ password }) => {
  const requirements = [
    { text: 'At least 8 characters', regex: /.{8,}/ },
    { text: 'At least one uppercase letter', regex: /[A-Z]/ },
    { text: 'At least one lowercase letter', regex: /[a-z]/ },
    { text: 'At least one number', regex: /[0-9]/ },
    { text: 'At least one special character', regex: /[^A-Za-z0-9]/ },
  ];

  const strength = requirements.reduce((acc, req) => {
    return acc + (req.regex.test(password) ? 1 : 0);
  }, 0);

  const getStrengthInfo = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Very Weak', color: '#ef4444' };
      case 2:
        return { text: 'Weak', color: '#f97316' };
      case 3:
        return { text: 'Fair', color: '#facc15' };
      case 4:
        return { text: 'Good', color: '#84cc16' };
      case 5:
        return { text: 'Strong', color: '#22c55e' };
      default:
        return { text: 'Very Weak', color: '#ef4444' };
    }
  };

  const { text, color } = getStrengthInfo(strength);

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#fafafa', borderRadius: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: '#374151', mr: 'auto' }}>
          Password Strength:
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: color }}>
          {text}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '4px', height: '8px', mb: 2 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              height: '100%',
              borderRadius: '4px',
              backgroundColor: index < strength ? color : '#e5e7eb',
              transition: 'background-color 0.3s ease-in-out',
            }}
          />
        ))}
      </Box>

      {password && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.5 }}>
          {requirements.map((req, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {req.regex.test(password) ? (
                <CheckCircleIcon sx={{ color: '#22c55e', fontSize: '1rem' }} />
              ) : (
                <CancelIcon sx={{ color: '#ef4444', fontSize: '1rem' }} />
              )}
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                {req.text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PasswordStrengthIndicator; 