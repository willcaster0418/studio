"use client";

import type { ChangeEvent } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import usePomodoroStore from '@/hooks/use-pomodoro-store';

export function SettingsDialog() {
  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    soundEnabled,
    notificationsEnabled,
    setDurations,
    toggleSound,
    toggleNotifications,
  } = usePomodoroStore();

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>, type: 'work' | 'short' | 'long') => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) return; // Basic validation
    setDurations({ [type]: value });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6" />
          <span className="sr-only">Open Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="work-duration" className="text-right">
              Work
            </Label>
            <Input
              id="work-duration"
              type="number"
              value={workDuration}
              onChange={(e) => handleDurationChange(e, 'work')}
              className="col-span-2 h-8"
              min="1"
            />
             <span className="col-start-2 col-span-2 text-xs text-muted-foreground -mt-2 ml-1">minutes</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="short-break-duration" className="text-right">
              Short Break
            </Label>
            <Input
              id="short-break-duration"
              type="number"
              value={shortBreakDuration}
              onChange={(e) => handleDurationChange(e, 'short')}
              className="col-span-2 h-8"
               min="1"
            />
            <span className="col-start-2 col-span-2 text-xs text-muted-foreground -mt-2 ml-1">minutes</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="long-break-duration" className="text-right">
              Long Break
            </Label>
            <Input
              id="long-break-duration"
              type="number"
              value={longBreakDuration}
              onChange={(e) => handleDurationChange(e, 'long')}
              className="col-span-2 h-8"
               min="1"
            />
            <span className="col-start-2 col-span-2 text-xs text-muted-foreground -mt-2 ml-1">minutes</span>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="flex flex-col gap-1">
              <span>Sound Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs">
                Play a sound when a session ends.
              </span>
            </Label>
            <Switch
              id="sound-enabled"
              checked={soundEnabled}
              onCheckedChange={toggleSound}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="popup-notifications-enabled" className="flex flex-col gap-1">
              <span>Popup Notifications</span>
               <span className="font-normal leading-snug text-muted-foreground text-xs">
                Show a browser popup when a session ends.
              </span>
            </Label>
            <Switch
              id="popup-notifications-enabled"
              checked={notificationsEnabled}
              onCheckedChange={toggleNotifications}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
