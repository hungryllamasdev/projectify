'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Task = {
  id: number;
  title: string;
  priority: string;
  status: string;
  assignee: string;
};

const initialTasks: Task[] = [
  { id: 1, title: 'Task 1', priority: 'High', status: 'In Progress', assignee: 'John Doe' },
  { id: 2, title: 'Task 2', priority: 'Medium', status: 'To Do', assignee: 'Jane Smith' },
  { id: 3, title: 'Task 3', priority: 'Low', status: 'Done', assignee: 'Alice Johnson' },
];

export default function ListView() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<Partial<Task>>({ title: '', priority: '', status: '', assignee: '' });
  const [sort, setSort] = useState<{ field: keyof Task; direction: 'asc' | 'desc' }>({
    field: 'title',
    direction: 'asc',
  });

  const filteredTasks = tasks.filter((task) =>
    (!filter.title || task.title.toLowerCase().includes(filter.title.toLowerCase())) &&
    (!filter.priority || task.priority === filter.priority) &&
    (!filter.status || task.status === filter.status) &&
    (!filter.assignee || task.assignee === filter.assignee)
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const field = sort.field;

    const valueA = a[field];
    const valueB = b[field];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sort.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sort.direction === 'asc' ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number);
  });

  const handleSort = (field: keyof Task) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <Input
          placeholder="Search tasks"
          onChange={(e) => setFilter((prev) => ({ ...prev, title: e.target.value }))}
        />
        <Select onValueChange={(value) => setFilter((prev) => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setFilter((prev) => ({ ...prev, status: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('title')}>
                Title
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('priority')}>
                Priority
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('status')}>
                Status
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('assignee')}>
                Assignee
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>
                <Button variant="ghost">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
