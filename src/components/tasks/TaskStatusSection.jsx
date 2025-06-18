import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { AssignmentTurnedInOutlined as AssignmentTurnedInOutlinedIcon } from '@mui/icons-material';

const TaskStatusSection = ({ tasks, isLoading, error }) => {
  const calculateTaskStatus = () => {
    if (!tasks || tasks.length === 0) {
      return { completed: 0, inProgress: 0, notStarted: 0, total: 0 };
    }

    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const notStarted = tasks.filter(task => task.status === 'pending').length;
    const total = tasks.length;

    return {
      completed,
      inProgress,
      notStarted,
      total,
      completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      inProgressPercentage: total > 0 ? Math.round((inProgress / total) * 100) : 0,
      notStartedPercentage: total > 0 ? Math.round((notStarted / total) * 100) : 0,
    };
  };

  const { completedPercentage, inProgressPercentage, notStartedPercentage } = calculateTaskStatus();

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <AssignmentTurnedInOutlinedIcon sx={{ color: '#A0AEC0', fontSize: 28, mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#EF4444' }}>Task Status</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <AssignmentTurnedInOutlinedIcon sx={{ color: '#A0AEC0', fontSize: 28, mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#EF4444' }}>Task Status</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#EF4444', textAlign: 'center' }}>
          Error loading task status
        </Typography>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AssignmentTurnedInOutlinedIcon sx={{ color: '#A0AEC0', fontSize: 28, mr: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#EF4444' }}>Task Status</Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: { xs: 4, sm: 0 },
        }}
      >
        {/* Completed */}
        <Box sx={{ textAlign: 'center', my: { xs: 2, sm: 0 } }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={completedPercentage}
              size={80}
              thickness={5}
              sx={{ color: '#22C55E' }}
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
              <Typography variant="h6" component="div" color="text.secondary" sx={{ fontWeight: 600 }}>
                {`${completedPercentage || 0}%`}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, color: '#22C55E', fontWeight: 500 }}>
            • Completed
          </Typography>
        </Box>

        {/* In Progress */}
        <Box sx={{ textAlign: 'center', my: { xs: 2, sm: 0 } }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={inProgressPercentage}
              size={80}
              thickness={5}
              sx={{ color: '#3B82F6' }}
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
              <Typography variant="h6" component="div" color="text.secondary" sx={{ fontWeight: 600 }}>
                {`${inProgressPercentage || 0}%`}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, color: '#3B82F6', fontWeight: 500 }}>
            • In Progress
          </Typography>
        </Box>

        {/* Not Started */}
        <Box sx={{ textAlign: 'center', my: { xs: 2, sm: 0 } }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={notStartedPercentage}
              size={80}
              thickness={5}
              sx={{ color: '#EF4444' }}
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
              <Typography variant="h6" component="div" color="text.secondary" sx={{ fontWeight: 600 }}>
                {`${notStartedPercentage || 0}%`}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 1, color: '#EF4444', fontWeight: 500 }}>
            • Not Started
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default TaskStatusSection;
