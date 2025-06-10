"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import usePomodoroStore from '@/hooks/use-pomodoro-store';
import { Target } from 'lucide-react'; // Using Target as a symbol for completed pomodoros

export function StatsDisplay() {
  const completedToday = usePomodoroStore((state) => state.completedToday);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pomodoros Today</CardTitle>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{completedToday}</div>
        <p className="text-xs text-muted-foreground">
          {completedToday === 1 ? "session completed" : "sessions completed"}
        </p>
      </CardContent>
    </Card>
  );
}
