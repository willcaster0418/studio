"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Task } from "@/hooks/use-pomodoro-store";
import usePomodoroStore from "@/hooks/use-pomodoro-store";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  task: Task;
}

export function TodoItem({ task }: TodoItemProps) {
  const { toggleTask, deleteTask } = usePomodoroStore();

  return (
    <li className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
          aria-labelledby={`task-label-${task.id}`}
        />
        <label
          id={`task-label-${task.id}`}
          htmlFor={`task-${task.id}`}
          className={cn(
            "flex-1 truncate cursor-pointer",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.text}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTask(task.id)}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        aria-label={`Delete task: ${task.text}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}
