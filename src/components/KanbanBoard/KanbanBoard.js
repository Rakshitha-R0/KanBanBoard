import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from '../Column/Column';
import Task from '../Task/Task';
import { TaskProvider, useTaskContext } from '../../context/Context';
import './KanbanBoard.scss';
import AddColumn from '../AddColumn/AddColumn';

const KanbanBoardContent = () => {
  const { columns, moveTask, addColumn } = useTaskContext();
  const [activeAddTaskColumn, setActiveAddTaskColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [showAddColumnPopup, setShowAddColumnPopup] = useState(false);
  const [fromWhichColumn, setFromWhichColumn] = useState('');
  const dropdownRef = useRef(null);
  const boardRef = useRef(null);

  useEffect(() => {console.log("RL's :", fromWhichColumn)}, [fromWhichColumn]);

  const handleDragStart = (event) => {
    const { active } = event;
    const { columnId } = active.data.current;
    const task = columns
      .find(column => column.id === columnId)
      ?.tasks.find(task => task.id === active.id);
    if (task) setActiveTask({ ...task, columnId });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const sourceColumnId = active.data.current.columnId;
    const targetColumnId =
      over.data.current?.type === 'column' ? over.id : over.data.current?.columnId;
    if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
      moveTask(active.id, sourceColumnId, targetColumnId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddColumnPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddColumn = (title, pos, referenceColumnId) => {
    console.log("RL's :", referenceColumnId)
    addColumn(title, pos, referenceColumnId);
    setShowAddColumnPopup(false);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board-container">
        <div className="kanban-board-wrapper">
          <div className="kanban-board" ref={boardRef}>
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
                  setShowAddColumnPopup={setShowAddColumnPopup}
                  setFromWhichColumn={setFromWhichColumn}
                />
              </SortableContext>
            ))}
            <button className="kanban-button" onClick={() => {setFromWhichColumn('');setShowAddColumnPopup(true)}}>
              + Add Section
            </button>
          </div>
        </div>
      </div>
      {showAddColumnPopup && (
        <div className="add-column-overlay">
          <span>{fromWhichColumn}</span>
          <AddColumn closePopup={() => setShowAddColumnPopup(false)} handleAddColumn={handleAddColumn} referenceColumnId={fromWhichColumn} setFromWhichColumn={setFromWhichColumn} />
        </div>
      )}
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
