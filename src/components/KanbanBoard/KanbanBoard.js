import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from '../Column/Column';
import Task from '../Task/Task';
import { TaskProvider, useTaskContext } from '../../context/TaskContext';
import './KanbanBoard.scss';

const KanbanBoardContent = () => {
  const { columns, addColumn, moveTask } = useTaskContext();
  const [activeAddTaskColumn, setActiveAddTaskColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [showAddColumnInput, setShowAddColumnInput] = useState(false);

  const handleDragStart = (event) => {
    const { active } = event;
    const { columnId } = active.data.current;
    const task = columns
      .find(column => column.id === columnId)
      .tasks.find(task => task.id === active.id);
    setActiveTask({ ...task, columnId });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const sourceColumnId = active.data.current.columnId;
    let targetColumnId;

    if (over.data.current?.type === 'column') {
      targetColumnId = over.id;
    } else {
      targetColumnId = over.data.current?.columnId;
    }

    if (sourceColumnId && targetColumnId && sourceColumnId !== targetColumnId) {
      moveTask(active.id, sourceColumnId, targetColumnId);
    }
  };

  const handleAddColumn = () => {
    if (newColumnName.trim() === '') return;
    addColumn(newColumnName);
    setNewColumnName('');
    setShowAddColumnInput(false);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {columns.map(column => (
          <SortableContext key={column.id} items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            <Column
              column={column}
              activeAddTaskColumn={activeAddTaskColumn}
              setActiveAddTaskColumn={setActiveAddTaskColumn}
            />
          </SortableContext>
        ))}
        <div className="add-column">
          {showAddColumnInput ? (
            <>
              <input
                type="text"
                placeholder="New section name"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
              <button className="kanban-button" onClick={handleAddColumn}>Confirm Add Section</button>
              <button className="kanban-button" onClick={() => setShowAddColumnInput(false)}>Cancel</button>
            </>
          ) : (
            <button className="kanban-button" onClick={() => setShowAddColumnInput(true)}>+ Add Section</button>
          )}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="task-overlay" style={{ transform: 'rotate(-5deg)' }}>
            <Task task={activeTask} columnId={activeTask.columnId} />
          </div>
        ) : null}
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
