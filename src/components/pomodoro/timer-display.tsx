"use client";

import usePomodoroStore from '@/hooks/use-pomodoro-store';
import { formatTime } from '@/lib/utils';

export function TimerDisplay() {
  const timeLeft = usePomodoroStore((state) => state.timeLeft);

  return (
    <div className="text-center">
      <p className="text-8xl font-bold font-mono text-primary tabular-nums" aria-label="Time remaining">
        {formatTime(timeLeft)}
      </p>
    </div>
  );
}
