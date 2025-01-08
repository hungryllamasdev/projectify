'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { SortableItem } from './SortableItem';

type Task = {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
};

type Tasks = {
  [key: string]: Task[];
};

const initialTasks: Tasks = {
  backlog: [
    { id: 'task1', content: 'Task 1', priority: 'low' },
    { id: 'task2', content: 'Task 2', priority: 'medium' },
  ],
  todo: [
    { id: 'task3', content: 'Task 3', priority: 'high' },
    { id: 'task4', content: 'Task 4', priority: 'medium' },
  ],
  inProgress: [{ id: 'task5', content: 'Task 5', priority: 'high' }],
  done: [{ id: 'task6', content: 'Task 6', priority: 'low' }],
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Tasks>(initialTasks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const activeContainer = Object.keys(tasks).find((key) =>
        tasks[key].some((task) => task.id === active.id)
      );
      const overContainer = Object.keys(tasks).find((key) =>
        tasks[key].some((task) => task.id === over.id)
      );

      if (!activeContainer || !overContainer) return;

      if (activeContainer === overContainer) {
        setTasks((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(
            prev[activeContainer],
            prev[activeContainer].findIndex((task) => task.id === active.id),
            prev[activeContainer].findIndex((task) => task.id === over.id)
          ),
        }));
      } else {
        setTasks((prev) => {
          const activeTask = prev[activeContainer].find((task) => task.id === active.id);
          if (!activeTask) return prev;

          return {
            ...prev,
            [activeContainer]: prev[activeContainer].filter((task) => task.id !== active.id),
            [overContainer]: [...prev[overContainer], activeTask],
          };
        });
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4">
        {Object.entries(tasks).map(([status, items]) => (
          <div key={status} className="bg-gray-100 p-4 rounded-lg w-64">
            <h3 className="text-lg font-semibold mb-2 capitalize">{status}</h3>
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              {items.map((task) => (
                <SortableItem key={task.id} id={task.id}>
                  <div className="bg-white p-2 mb-2 rounded shadow">
                    {task.content}
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        task.priority === 'high'
                          ? 'bg-red-200'
                          : task.priority === 'medium'
                          ? 'bg-yellow-200'
                          : 'bg-green-200'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
