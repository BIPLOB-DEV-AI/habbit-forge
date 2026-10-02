import { Habit, TodoTask, PlannerProfile } from '../types';
import { INITIAL_HABITS, INITIAL_TASKS, INITIAL_PROFILE } from '../data/initialData';

const HABITS_KEY = 'habitforge_habits_v1';
const TASKS_KEY = 'habitforge_tasks_v1';
const PROFILE_KEY = 'habitforge_profile_v1';

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_HABITS;
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits', e);
  }
}

export function loadTasks(): TodoTask[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_TASKS;
}

export function saveTasks(tasks: TodoTask[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

export function loadProfile(): PlannerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...INITIAL_PROFILE, ...parsed };
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_PROFILE;
}

export function saveProfile(profile: PlannerProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function resetAllToDefaults(): { habits: Habit[]; tasks: TodoTask[]; profile: PlannerProfile } {
  localStorage.removeItem(HABITS_KEY);
  localStorage.removeItem(TASKS_KEY);
  localStorage.removeItem(PROFILE_KEY);
  return {
    habits: INITIAL_HABITS,
    tasks: INITIAL_TASKS,
    profile: INITIAL_PROFILE,
  };
}
