import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { DonutLarge as DonutLargeIcon } from '@mui/icons-material';

const TaskStatusSection = ({ tasks, isLoading, error }) => {
  const calculateTaskStatus = () => {
    if (!tasks || tasks.length === 0) {
      return { 
        completedPercentage: 0, 
        inProgressPercentage: 0, 
        notStartedPercentage: 0 
      };
    }

    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const notStarted = tasks.filter(task => task.status === 'pending').length;

    return {
      completedPercentage: Math.round((completed / total) * 100),
      inProgressPercentage: Math.round((inProgress / total) * 100),
      notStartedPercentage: Math.round((notStarted / total) * 100),
    };
  };

  const { completedPercentage, inProgressPercentage, notStartedPercentage } = calculateTaskStatus();

  const renderStatusCircle = (percentage, label, color) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                  variant="determinate"
                  value={100}
                  size={90}
                  thickness={2}
                  sx={{ color: '#e0e7ff' }}
              />
              <CircularProgress
                  variant="determinate"
                  value={percentage}
                  size={90}
                  thickness={3}
                  sx={{
                      color: color,
                      position: 'absolute',
                      left: 0,
                      animation: '$progress-animation 1s ease-out',
                  }}
              />
              <Box
                  sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                  }}
              >
                  <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: color }}>
                      {`${percentage || 0}%`}
                  </Typography>
              </Box>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#4b5563' }}>
              {label}
          </Typography>
      </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3, border: '1px solid #ddd6fe', borderRadius: 2 }}>
        <Typography>Loading Status...</Typography>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, border: '1px solid #fecaca', borderRadius: 2 }}>
        <Typography color="error">Error loading task status.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>Task Status</Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: { xs: 4, sm: 2 },
        }}
      >
        {renderStatusCircle(completedPercentage, 'Completed', '#10b981')}
        {renderStatusCircle(inProgressPercentage, 'In Progress', '#6366f1')}
        {renderStatusCircle(notStartedPercentage, 'Not Started', '#f59e0b')}
      </Box>
    </Box>
  );
};

export default TaskStatusSection;
