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
    longBreakDuration
  } = usePomodoroStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const firstRender = useRef(true); // To prevent effects on initial mount for certain conditions

  // Initialize daily stats on component mount
  useEffect(() => {
    _initializeDailyStats();
  }, [_initializeDailyStats]);

  // Timer interval effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const { playSound, showNotification, notificationMessage } = tick();
        if (playSound) {
          console.log("Sound notification!"); // Placeholder for actual sound
          // Example: new Audio('/path/to/sound.mp3').play();
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
                  alert(`PomoZen: ${notificationMessage}`); // Fallback for permission not granted
                }
              });
            } else {
               alert(`PomoZen: ${notificationMessage}`); // Fallback for permission denied
            }
          } else if (notificationsEnabled) { // Fallback if Notification API not available or explicitly disabled store-wise
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

  // Update document title with time left
  useEffect(() => {
    if (typeof window !== "undefined") {
      const modeText = currentMode === 'work' ? 'Work' : currentMode === 'shortBreak' ? 'Short Break' : 'Long Break';
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      document.title = `${timeString} - ${modeText} | PomoZen`;
    }
  }, [timeLeft, currentMode]);

  // Request notification permission on load if not already set
   useEffect(() => {
    if (firstRender.current) { // Only run on first effective render
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
          // Optional: Prompt user to enable notifications if they are enabled in settings
          // For now, let's not be too intrusive. Permission will be asked on first notification.
          // Notification.requestPermission(); 
        }
      }
      firstRender.current = false;
    }
  }, []);


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
