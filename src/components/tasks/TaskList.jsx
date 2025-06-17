import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getTasks, searchTasks, getTasksByStatus } from '../../services/api';
import TaskItem from './TaskItem';
import { toast } from 'react-toastify';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from "@tanstack/react-query";
import {
  CircularProgress,
  Typography,
} from "@mui/material";

const TaskList = ({ onEditTask, searchQuery, searchCriteria, statusFilter, priorityFilter, sortBy, sortDirection = 'desc', singleColumn }) => {
  const { user } = useAuth();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const filteredTasks = tasks?.filter((task) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    let matchesSearch = false;

    if (searchCriteria === "title") {
      matchesSearch = task.title.toLowerCase().includes(lowerCaseSearchQuery);
    } else if (searchCriteria === "description") {
      matchesSearch = (task.description || '').toLowerCase().includes(lowerCaseSearchQuery);
    } else {
      matchesSearch = 
        task.title.toLowerCase().includes(lowerCaseSearchQuery) ||
        (task.description || '').toLowerCase().includes(lowerCaseSearchQuery);
    }

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTasks = useMemo(() => {
    if (!filteredTasks) return [];
    
    return [...filteredTasks].sort((a, b) => {
      const direction = sortDirection === 'desc' ? -1 : 1;
      
    switch (sortBy) {
      case "title":
          return direction * a.title.localeCompare(b.title);
        
      case "dueDate":
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          // Handle null/invalid dates by putting them at the end
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return direction;
          if (isNaN(dateB.getTime())) return -direction;
          return direction * (dateA.getTime() - dateB.getTime());
        
        case "createdAt":
          const createdAtA = new Date(a.createdAt);
          const createdAtB = new Date(b.createdAt);
          return direction * (createdAtA.getTime() - createdAtB.getTime());
        
      case "priority":
      const priorityOrder = { high: 3, medium: 2, low: 1 };
          // For ascending: low→high, For descending: high→low
          return direction * (priorityOrder[a.priority] - priorityOrder[b.priority]);
        
      default:
          // Default to sort by creation date
          const defaultA = new Date(a.createdAt);
          const defaultB = new Date(b.createdAt);
          return direction * (defaultA.getTime() - defaultB.getTime());
    }
  });
  }, [filteredTasks, sortBy, sortDirection]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading tasks: {error.message}
      </div>
    );
  }

  return (
    <div className={`grid ${singleColumn ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'} gap-4`}>
      {sortedTasks?.length === 0 ? (
        <div className="p-8 text-center text-gray-500 col-span-full">
          <Typography variant="h6" color="textSecondary">
            No tasks found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your filters"
              : "Create a new task to get started"}
      </Typography>
        </div>
            ) : (
        sortedTasks?.map((task) => (
          <TaskItem key={task._id} task={task} onEdit={onEditTask} />
        ))
            )}
    </div>
  );
};

export default TaskList;