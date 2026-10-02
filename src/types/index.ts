export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export type HabitCategory =
  | 'Health'
  | 'Fitness'
  | 'Learning'
  | 'Productivity'
  | 'Mindset'
  | 'Finance'
  | 'Personal'
  | 'Lifestyle';

export type DayStatus = 'completed' | 'missed' | 'empty';

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  weeklyGoal: number; // e.g. 5 out of 7 days
  weeklyLogs: Record<string, Record<DayKey, DayStatus>>; // weekId -> { mon: 'completed', ... }
  monthlyLogs: Record<string, number>; // "2026-01" -> completion percentage or days achieved
  createdDate: string;
  color?: string;
  notes?: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TodoTask {
  id: string;
  task: string;
  category: HabitCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  done: boolean;
}

export interface PlannerProfile {
  name: string;
  startDate: string;
  year: number;
  vision: string;
  monthlyGoals: Record<string, string[]>; // e.g. "JAN": ["Run 50km", "Read 2 books"]
  notes: string;
}
