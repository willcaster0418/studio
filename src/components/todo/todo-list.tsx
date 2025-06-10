"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import usePomodoroStore from '@/hooks/use-pomodoro-store';
import { TodoItem } from './todo-item';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TodoList() {
  const [newTaskText, setNewTaskText] = useState('');
  const { tasks, addTask, clearCompletedTasks } = usePomodoroStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const uncompletedTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks for this Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            aria-label="New task"
          />
          <Button type="submit" size="icon" aria-label="Add task">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </form>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add some to get started!</p>
        ) : (
          <ScrollArea className="h-[200px] pr-3"> {/* Adjust height as needed */}
            <ul className="space-y-1">
              {uncompletedTasks.map((task) => (
                <TodoItem key={task.id} task={task} />
              ))}
              {completedTasks.length > 0 && uncompletedTasks.length > 0 && <hr className="my-2"/>}
              {completedTasks.map((task) => (
                <TodoItem key={task.id} task={task} />
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
      {completedTasks.length > 0 && (
         <CardFooter>
            <Button variant="outline" onClick={clearCompletedTasks} className="w-full">
              Clear Completed Tasks
            </Button>
          </CardFooter>
      )}
    </Card>
  );
}
