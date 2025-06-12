import React from 'react';
import { Typography } from '@mui/material';
import TaskList from './tasks/TaskList';

const CompletedTasks = ({ onEditTask, searchQuery, priorityFilter, sortBy }) => {
  return (
    <div>
      <div className="bg-white shadow rounded-lg p-4">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
          Completed Tasks
        </Typography>
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