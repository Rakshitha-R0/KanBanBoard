import React, { useState, useRef, useEffect } from 'react';
import Task from '../Task/Task';
import './Column.scss';

const Column = ({ column, addTask, moveTask, deleteTask, deleteColumn }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskType, setTaskType] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const handleAddTask = () => {
    if (taskType === '') return;
    const newTask = { id: Date.now(), title: taskTitle, dueTime: taskDueTime, type: taskType };
    addTask(column.id, newTask);
    setTaskTitle('');
    setTaskDueTime('');
    setTaskType('');
    setShowAddTask(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    moveTask(parseInt(taskId), parseInt(sourceColumnId), column.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.target.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.classList.remove('drag-over');
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setDate(today.getDate() + 14));
    return maxDate.toISOString().split('T')[0];
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
    <div className="column" onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
      <div className="column-header">
        <div className="column-title">{column.title}</div>
        <div className="column-options" ref={optionsRef}>
        <span class="material-symbols-outlined">
        add
        </span>
          <span className="material-symbols-outlined" onClick={() => setShowOptions(!showOptions)}>
            more_horiz
          </span>
          {showOptions && column.title === 'Review' && (
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
            deleteTask={() => deleteTask(column.id, task.id)} 
          />
        ))}
        {column.title === 'Review' && column.tasks.length === 0 && (
          <div className="empty-task-card">Empty task</div>
        )}
        {column.title !== 'Review' && (
          <>
            {showAddTask ? (
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
                  max={getMaxDate()}
                  onChange={(e) => setTaskDueTime(e.target.value)}
                />
                <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                  <option value="" disabled placeholder=''>Type</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                </select>
                <button className="kanban-button" onClick={handleAddTask}>Confirm Add Task</button>
                <button className="kanban-button" onClick={() => setShowAddTask(false)}>Cancel</button>
              </>
            ) : (
              <button className="kanban-button" onClick={() => setShowAddTask(true)}>+ Add Task</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Column;
