import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from '../Column/Column';
import Task from '../Task/Task';
import { TaskProvider, useTaskContext } from '../../context/Context';
import './KanbanBoard.scss';

const KanbanBoardContent = () => {
  const { columns, moveTask, addColumn } = useTaskContext();
  const [activeAddTaskColumn, setActiveAddTaskColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [showAddColumnOptions, setShowAddColumnOptions] = useState(false);
  const [customColumnTitle, setCustomColumnTitle] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const dropdownRef = useRef(null);

  const handleDragStart = (event) => {
    const { active } = event;
    const { columnId } = active.data.current;
    const task = columns
      .find(column => column.id === columnId)
      ?.tasks.find(task => task.id === active.id);
    task && setActiveTask({ ...task, columnId });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const sourceColumnId = active.data.current.columnId;
    const targetColumnId = over.data.current?.type === 'column' 
      ? over.id
      : over.data.current?.columnId;

    if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
      moveTask(active.id, sourceColumnId, targetColumnId);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowAddColumnOptions(false);
      setSelectedOption('');
      setCustomColumnTitle('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddColumn = (title) => {
    addColumn(title, 'end');
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
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="kanban-board-container">
        <div className="kanban-board">
          {columns.map(column => (
            <SortableContext 
              key={column.id} 
              items={column.tasks.map(task => task.id)} 
              strategy={verticalListSortingStrategy}
            >
              <Column
                column={column}
                activeAddTaskColumn={activeAddTaskColumn}
                setActiveAddTaskColumn={setActiveAddTaskColumn}
              />
            </SortableContext>
          ))}
          
          <div className="add-column" ref={dropdownRef}>
            <button 
              className="kanban-button"
              onClick={() => setShowAddColumnOptions(true)}>
              + Add Section
            </button>
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
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="task-overlay" style={{ transform: 'rotate(-5deg)' }}>
            <Task task={activeTask} columnId={activeTask.columnId} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

const KanbanBoard = () => (
  <TaskProvider>
    <KanbanBoardContent />
  </TaskProvider>
);

export default KanbanBoard;
