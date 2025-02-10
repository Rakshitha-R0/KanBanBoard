import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import Task from '../Task/Task';
import AddTask from '../AddTask/AddTask';
import { useTaskContext } from '../../context/Context';
import './Column.scss';

const Column = ({ column, activeAddTaskColumn, setActiveAddTaskColumn, setShowAddColumnPopup, handleAddColumn, setFromWhichColumn }) => {
  const { addTask, deleteColumn, modifyColumn } = useTaskContext();
  const [showOptions, setShowOptions] = useState(false);
  const [showModifyColumnOptions, setShowModifyColumnOptions] = useState(false);
  const [customColumnTitle, setCustomColumnTitle] = useState('');
  const optionsRef = useRef(null);

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: column.id,
    data: { type: 'column' }
  });

  const handleClickOutside = (event) => {   
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
      setShowModifyColumnOptions(false);
      setCustomColumnTitle('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModifyColumn = (title) => {
    modifyColumn(column.id, title);
    setShowModifyColumnOptions(false);
    setCustomColumnTitle('');
  };

  const handleModifyColumnSubmit = () => {
    if (customColumnTitle.trim() !== '') {
      handleModifyColumn(customColumnTitle);
    }
  };

  const handleBack = () => {
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
          <span className="material-symbols-outlined" onClick={() => {setFromWhichColumn(column?.id);setShowAddColumnPopup(true)}}>
            add
          </span>
          <span className="material-symbols-outlined" onClick={() => setShowOptions(!showOptions)}>
            more_horiz
          </span>
          {showOptions && (
            <div className="column-options-menu">
              <button className="kanban-button" onClick={() => setShowModifyColumnOptions(true)}>Modify</button>
              <button className="kanban-button" onClick={() => deleteColumn(column.id)}>Delete</button>
            </div>
          )}
          {showModifyColumnOptions && (
            <div className="modify-column-options">
              <input
                type="text"
                placeholder="New column title"
                value={customColumnTitle}
                onChange={(e) => setCustomColumnTitle(e.target.value)}
              />
              <div className="button-group">
                <button className="kanban-button" onClick={handleModifyColumnSubmit}>Confirm</button>
                <button className="kanban-button" onClick={handleBack}>Back</button>
              </div>
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
        <button className="kanban-button" style={{ alignSelf: 'center' }} onClick={() => setActiveAddTaskColumn(column.id)}>+ Add Task</button>
        {activeAddTaskColumn === column.id && (
          <AddTask 
            columnId={column.id} 
            addTask={addTask} 
            closePopup={() => setActiveAddTaskColumn(null)} 
          />
        )}
        {/* {showAddColumnForColumn === column.id && (
          <AddColumn closePopup={() => setShowAddColumnForColumn(null)} handleAddColumn={handleAddColumn} pos={'next'} />
        )} */}
      </div>
    </div>
  );
};

export default Column;
