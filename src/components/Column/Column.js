import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import Task from '../Task/Task';
import { useTaskContext } from '../../context/TaskContext';
import './Column.scss';

const Column = ({ column, activeAddTaskColumn, setActiveAddTaskColumn }) => {
  const { addTask, deleteColumn } = useTaskContext();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskType, setTaskType] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'column' }
  });

  const handleAddTask = () => {
    if (taskType === '') return;
    try {
      const newTask = { id: Date.now(), title: taskTitle, dueTime: taskDueTime, type: taskType };
      addTask(column.id, newTask);
      setTaskTitle('');
      setTaskDueTime('');
      setTaskType('');
      setActiveAddTaskColumn(null);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className="column" 
      ref={setDroppableNodeRef} 
    >
      <div className="column-header">
        <div className="column-title">{column.title}</div>
        <div className="column-options" ref={optionsRef}>
        <span className="material-symbols-outlined" onClick={() => setActiveAddTaskColumn(column.id)}>
            add
          </span>
          <span className="material-symbols-outlined" onClick={() => setShowOptions(!showOptions)}>
            more_horiz
          </span>
          {showOptions && column.id > 2 && (
            <div className="column-options-menu">
              <button className="kanban-button" onClick={() => deleteColumn(column.id)}>Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="column-content">
        {column.tasks.map(task => (
          <Task 
            key={task.id} 
            task={task} 
            columnId={column.id}
          />
        ))}
        {column.title === 'Review' && column.tasks.length === 0 && (
          <div className="empty-task-card">Empty task</div>
        )}
        {column.title !== 'Review' && (
          <>
            {activeAddTaskColumn === column.id ? (
              <>
                <input
                  type="text"
                  placeholder="Task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Due time"
                  value={taskDueTime}
                  min={getMinDate()}
                  onChange={(e) => setTaskDueTime(e.target.value)}
                />
                <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                  <option value="" disabled placeholder=''>Type</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                </select>
                <button className="kanban-button" onClick={handleAddTask}>Confirm Add Task</button>
                <button className="kanban-button" onClick={() => setActiveAddTaskColumn(null)}>Cancel</button>
              </>
            ) : (
              <button className="kanban-button" onClick={() => setActiveAddTaskColumn(column.id)}>+ Add Task</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Column;
