"use client";

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import usePomodoroStore, { type TimerMode } from '@/hooks/use-pomodoro-store';

export function SessionSelector() {
  const { currentMode, setCurrentMode, isRunning } = usePomodoroStore();

  const handleModeChange = (mode: string) => {
    if (isRunning) {
      // Optionally, add a confirmation dialog here if timer is running
      console.warn("Cannot change mode while timer is running. Pause or reset first.");
      return;
    }
    setCurrentMode(mode as TimerMode);
  };

  return (
    <Tabs value={currentMode} onValueChange={handleModeChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="work" disabled={isRunning}>Work</TabsTrigger>
        <TabsTrigger value="shortBreak" disabled={isRunning}>Short Break</TabsTrigger>
        <TabsTrigger value="longBreak" disabled={isRunning}>Long Break</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
