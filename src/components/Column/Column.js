import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import Task from '../Task/Task';
import AddTask from '../AddTask/AddTask';
import { useTaskContext } from '../../context/Context';
import './Column.scss';

const Column = ({ column, activeAddTaskColumn, setActiveAddTaskColumn }) => {
  const { addTask, deleteColumn, addColumn } = useTaskContext();
  const [showOptions, setShowOptions] = useState(false);
  const [showAddColumnOptions, setShowAddColumnOptions] = useState(false);
  const [customColumnTitle, setCustomColumnTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const optionsRef = useRef(null);

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'column' }
  });

  const handleClickOutside = (event) => {   
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
      setShowAddColumnOptions(false);
      setSelectedOption('');
      setCustomColumnTitle('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddColumn = (title) => {
    addColumn(title, 'next', column.id);
    setShowAddColumnOptions(false);
    setSelectedOption('');
    setCustomColumnTitle('');
  };

  const handleCustomColumnSubmit = () => {
    if (customColumnTitle.trim() !== '') {
      handleAddColumn(customColumnTitle);
    }
  };

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (value !== 'Custom') {
      handleAddColumn(value);
    }
  };

  const handleBack = () => {
    setSelectedOption('');
    setCustomColumnTitle('');
  };

  return (
    <div 
      className="column" 
      ref={setDroppableNodeRef} 
    >
      <div className="column-header">
        <div className="column-title">{column.title}</div>
        <div className="column-options" ref={optionsRef}>
          <span className="material-symbols-outlined" onClick={() => setShowAddColumnOptions(true)}>
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
          {showAddColumnOptions && (
            <div className="add-column-options">
              {selectedOption !== 'Custom' ? (
                <>
                  <select value={selectedOption} onChange={handleOptionChange} className="kanban-input">
                    <option value="" disabled>Select Column</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Custom">+ Custom</option>
                  </select>
                </>
              ) : (
                <div className="custom-column">
                  <input
                    type="text"
                    placeholder="Custom column title"
                    value={customColumnTitle}
                    onChange={(e) => setCustomColumnTitle(e.target.value)}
                  />
                  <button className="kanban-button" onClick={handleCustomColumnSubmit}>Confirm</button>
                  <button className="kanban-button" onClick={handleBack}>Back</button>
                </div>
              )}
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
        {(column.title === 'To Do' || column.title === 'In Progress') && (
          <button className="kanban-button" style={{ alignSelf: 'center' }} onClick={() => setActiveAddTaskColumn(column.id)}>+ Add Task</button>
        )}
        {activeAddTaskColumn === column.id && (
          <AddTask 
            columnId={column.id} 
            addTask={addTask} 
            closePopup={() => setActiveAddTaskColumn(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Column;
