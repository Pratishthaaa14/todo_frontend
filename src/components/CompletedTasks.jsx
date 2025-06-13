import React from 'react';
import { Typography } from '@mui/material';
import TaskList from './tasks/TaskList';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';

const CompletedTasks = ({ onEditTask, searchQuery, priorityFilter, sortBy }) => {
  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center mb-4">
          <CheckCircleOutlineIcon sx={{ color: '#A0AEC0', fontSize: 28, mr: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#EF4444' }}>
            Completed Tasks
          </Typography>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <TaskList
            onEditTask={onEditTask}
            searchQuery={searchQuery}
            statusFilter="completed"
            priorityFilter={priorityFilter}
            sortBy={sortBy}
            singleColumn
          />
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks; 