"use client";

import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import usePomodoroStore from '@/hooks/use-pomodoro-store';

export function TimerControls() {
  const { isRunning, startTimer, pauseTimer, resetTimer, currentMode } = usePomodoroStore();

  return (
    <div className="flex justify-center gap-4">
      {isRunning ? (
        <Button onClick={pauseTimer} size="lg" className="px-8 py-6 text-lg bg-accent hover:bg-accent/90">
          <Pause className="mr-2 h-6 w-6" /> Pause
        </Button>
      ) : (
        <Button onClick={startTimer} size="lg" className="px-8 py-6 text-lg">
          <Play className="mr-2 h-6 w-6" /> Start
        </Button>
      )}
      <Button onClick={() => resetTimer(currentMode)} variant="outline" size="lg" className="px-8 py-6 text-lg">
        <RotateCcw className="mr-2 h-6 w-6" /> Reset
      </Button>
    </div>
  );
}
