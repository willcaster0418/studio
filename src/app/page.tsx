"use client";

import { useEffect, useRef } from 'react';
import { Leaf } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { SettingsDialog } from '@/components/settings-dialog';
import { TimerDisplay } from '@/components/pomodoro/timer-display';
import { TimerControls } from '@/components/pomodoro/timer-controls';
import { SessionSelector } from '@/components/pomodoro/session-selector';
import { TodoList } from '@/components/todo/todo-list';
import { StatsDisplay } from '@/components/stats-display';
import usePomodoroStore from '@/hooks/use-pomodoro-store';
import { useToast } from "@/hooks/use-toast";


export default function PomoZenPage() {
  const { 
    tick, 
    isRunning, 
    notificationsEnabled, 
    soundEnabled, 
    _initializeDailyStats,
    currentMode,
    timeLeft,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    startTimer,
    pauseTimer
  } = usePomodoroStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const firstRender = useRef(true); 

  useEffect(() => {
    _initializeDailyStats();
  }, [_initializeDailyStats]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const { playSound, showNotification, notificationMessage } = tick();
        if (playSound) {
          console.log("Sound notification!"); 
        }
        if (showNotification && notificationMessage) {
          if (typeof window !== "undefined" && notificationsEnabled) {
            if (Notification.permission === "granted") {
              new Notification("PomoZen", { body: notificationMessage });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                  new Notification("PomoZen", { body: notificationMessage });
                } else {
                  alert(`PomoZen: ${notificationMessage}`); 
                }
              });
            } else {
               alert(`PomoZen: ${notificationMessage}`); 
            }
          } else if (notificationsEnabled) { 
             alert(`PomoZen: ${notificationMessage}`);
          }
           toast({
            title: "Session Ended",
            description: notificationMessage,
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, tick, notificationsEnabled, soundEnabled, toast]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const modeText = currentMode === 'work' ? 'Work' : currentMode === 'shortBreak' ? 'Short Break' : 'Long Break';
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      document.title = `${timeString} - ${modeText} | PomoZen`;
    }
  }, [timeLeft, currentMode]);

   useEffect(() => {
    if (firstRender.current) { 
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        }
      }
      firstRender.current = false;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        if (isRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning, startTimer, pauseTimer]);


  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8 selection:bg-primary/20">
      <header className="w-full max-w-2xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary">PomoZen</h1>
        </div>
        <SettingsDialog />
      </header>

      <main className="w-full max-w-md flex flex-col gap-6">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="p-4 bg-card">
            <SessionSelector />
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
            <TimerDisplay />
          </CardContent>
          <CardFooter className="p-6 bg-card/50">
            <TimerControls />
          </CardFooter>
        </Card>

        <TodoList />
        <StatsDisplay />
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PomoZen. Focus and achieve.</p>
      </footer>
    </div>
  );
}
