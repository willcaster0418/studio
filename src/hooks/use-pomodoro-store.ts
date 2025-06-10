import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroState {
  // Settings
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  pomodorosPerCycle: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;

  // Timer state
  currentMode: TimerMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  pomodoroCountInCycle: number; // current pomodoros in this cycle
  completedToday: number;
  lastResetDate: string; // To reset completedToday daily

  // Tasks
  tasks: Task[];

  // Actions
  setDurations: (durations: { work?: number; short?: number; long?: number }) => void;
  toggleSound: () => void;
  toggleNotifications: () => void;

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (switchToMode?: TimerMode, resetCurrentTask?: boolean) => void;
  tick: () => { playSound: boolean, showNotification: boolean, notificationMessage?: string }; // Returns flags for effects

  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompletedTasks: () => void;
  
  setCurrentMode: (mode: TimerMode) => void;
  _initializeDailyStats: () => void;
}

const INITIAL_WORK_DURATION = 25;
const INITIAL_SHORT_BREAK_DURATION = 5;
const INITIAL_LONG_BREAK_DURATION = 15;
const POMODOROS_PER_CYCLE = 4;

const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      workDuration: INITIAL_WORK_DURATION,
      shortBreakDuration: INITIAL_SHORT_BREAK_DURATION,
      longBreakDuration: INITIAL_LONG_BREAK_DURATION,
      pomodorosPerCycle: POMODOROS_PER_CYCLE,
      soundEnabled: true,
      notificationsEnabled: true,

      currentMode: 'work',
      timeLeft: INITIAL_WORK_DURATION * 60,
      isRunning: false,
      pomodoroCountInCycle: 0,
      completedToday: 0,
      lastResetDate: new Date().toDateString(),

      tasks: [],

      setDurations: ({ work, short, long }) => set((state) => {
        const newDurations = {
          workDuration: work ?? state.workDuration,
          shortBreakDuration: short ?? state.shortBreakDuration,
          longBreakDuration: long ?? state.longBreakDuration,
        };
        // If current mode duration changes, reset timeLeft for that mode if not running
        if (!state.isRunning) {
          if (state.currentMode === 'work' && work !== undefined) {
            return { ...newDurations, timeLeft: newDurations.workDuration * 60 };
          }
          if (state.currentMode === 'shortBreak' && short !== undefined) {
            return { ...newDurations, timeLeft: newDurations.shortBreakDuration * 60 };
          }
          if (state.currentMode === 'longBreak' && long !== undefined) {
            return { ...newDurations, timeLeft: newDurations.longBreakDuration * 60 };
          }
        }
        return newDurations;
      }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      startTimer: () => {
        get()._initializeDailyStats(); // Ensure stats are up-to-date before starting
        if (get().timeLeft > 0) {
          set({ isRunning: true });
        }
      },
      pauseTimer: () => set({ isRunning: false }),
      
      resetTimer: (switchToMode) => {
        const targetMode = switchToMode ?? get().currentMode;
        let newTimeLeft;
        switch (targetMode) {
          case 'work':
            newTimeLeft = get().workDuration * 60;
            break;
          case 'shortBreak':
            newTimeLeft = get().shortBreakDuration * 60;
            break;
          case 'longBreak':
            newTimeLeft = get().longBreakDuration * 60;
            break;
          default:
            newTimeLeft = get().workDuration * 60;
        }
        set({ isRunning: false, timeLeft: newTimeLeft, currentMode: targetMode });
      },

      setCurrentMode: (mode) => {
        get().resetTimer(mode);
      },

      tick: () => {
        let playSound = false;
        let showNotification = false;
        let notificationMessage = '';

        if (!get().isRunning || get().timeLeft <= 0) return { playSound, showNotification };

        set((state) => ({ timeLeft: state.timeLeft - 1 }));

        if (get().timeLeft === 0) {
          const currentMode = get().currentMode;
          const pomodorosPerCycle = get().pomodorosPerCycle;
          
          playSound = get().soundEnabled;
          showNotification = get().notificationsEnabled;

          if (currentMode === 'work') {
            set((state) => ({
              pomodoroCountInCycle: (state.pomodoroCountInCycle + 1) % pomodorosPerCycle,
              completedToday: state.completedToday + 1,
            }));
            notificationMessage = "Work session complete! Time for a break.";
            
            if (get().pomodoroCountInCycle === 0) { // Completed a full cycle
              get().resetTimer('longBreak');
            } else {
              get().resetTimer('shortBreak');
            }
          } else if (currentMode === 'shortBreak') {
            notificationMessage = "Short break over! Back to work.";
            get().resetTimer('work');
          } else { // longBreak finished
            notificationMessage = "Long break over! Ready for a new cycle?";
            get().resetTimer('work');
          }
        }
        return { playSound, showNotification, notificationMessage };
      },

      addTask: (text) => set((state) => ({
        tasks: [...state.tasks, { id: Date.now().toString(), text, completed: false }],
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),
      clearCompletedTasks: () => set((state) => ({
        tasks: state.tasks.filter((task) => !task.completed),
      })),
      
      _initializeDailyStats: () => {
        const today = new Date().toDateString();
        if (get().lastResetDate !== today) {
          set({ completedToday: 0, pomodoroCountInCycle: 0, lastResetDate: today });
        }
      },
    }),
    {
      name: 'pomozen-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._initializeDailyStats();
        }
      }
    }
  )
);

export default usePomodoroStore;
