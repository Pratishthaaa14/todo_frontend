import React from 'react';
import { Typography } from '@mui/material';
import TaskList from './tasks/TaskList';
import { TaskAlt as TaskAltIcon } from '@mui/icons-material';

const CompletedTasks = ({ onEditTask, searchQuery, searchCriteria, priorityFilter, sortBy, sortDirection }) => {
  return (
    <div>
      <div className="bg-white p-4">
        <div className="flex items-center mb-4">
          <TaskAltIcon sx={{ color: '#5b21b6', fontSize: 28, mr: 1.5 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#5b21b6' }}>
            Completed Tasks
          </Typography>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <TaskList
            onEditTask={onEditTask}
            searchQuery={searchQuery}
            searchCriteria={searchCriteria}
            statusFilter="completed"
            priorityFilter={priorityFilter}
            sortBy={sortBy}
            sortDirection={sortDirection}
            singleColumn
          />
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks; 