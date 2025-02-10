import React, { createContext, useState, useContext, useEffect } from 'react';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [columns, setColumns] = useState(() => {
    const savedColumns = sessionStorage.getItem('columns');
    return savedColumns ? JSON.parse(savedColumns) : [
      { id: 1, title: 'To Do', tasks: [] },
      { id: 2, title: 'In Progress', tasks: [] },
    ];
  });

  useEffect(() => {
    sessionStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  const addColumn = (title, position, referenceColumnId = null) => {
    console.log('addColumn', title, position, referenceColumnId);
    setColumns(prevColumns => {
      const newColumnId = prevColumns.length > 0
        ? Math.max(...prevColumns.map(col => col.id)) + 1
        : 1;
      const newColumn = { id: newColumnId, title, tasks: [] };
  
      if (position === 'end' || referenceColumnId === null) {
        return [...prevColumns, newColumn];
      } else if (position === 'next') {
        const index = prevColumns.findIndex(column => column.id === referenceColumnId);
        if (index === -1) {
          console.warn("Reference column not found, appending at end.");
          return [...prevColumns, newColumn];
        }
        return [
          ...prevColumns.slice(0, index + 1),
          newColumn,
          ...prevColumns.slice(index + 1)
        ];
      }
      return prevColumns;
    });
  };

  const deleteColumn = (columnId) => {
    setColumns(columns.filter(column => column.id !== columnId));
  };

  const addTask = (columnId, task) => {
    setColumns(columns.map(column =>
      column.id === columnId ? { ...column, tasks: [...column.tasks, task] } : column
    ));
  };

  const modifyTask = (columnId, modifiedTask) => {
    setColumns(columns.map(column =>
      column.id === columnId ? {
        ...column,
        tasks: column.tasks.map(task => task.id === modifiedTask.id ? modifiedTask : task)
      } : column
    ));
  };

  const deleteTask = (columnId, taskId) => {
    setColumns(columns.map(column =>
      column.id === columnId ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) } : column
    ));
  };

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    setColumns(prevColumns => {
      const sourceColumn = prevColumns.find(col => col.id === sourceColumnId);
      const targetColumn = prevColumns.find(col => col.id === targetColumnId);
      
      if (!sourceColumn || !targetColumn) return prevColumns;

      const task = sourceColumn.tasks.find(t => t.id === taskId);
      if (!task) return prevColumns;

      return prevColumns.map(column => {
        if (column.id === sourceColumnId) {
          return { ...column, tasks: column.tasks.filter(t => t.id !== taskId) };
        }
        if (column.id === targetColumnId) {
          return { ...column, tasks: [...column.tasks, task] };
        }
        return column;
      });
    });
  };

  return (
    <TaskContext.Provider value={{ 
      columns, 
      addColumn, 
      deleteColumn, 
      addTask, 
      modifyTask, 
      deleteTask, 
      moveTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
