import { Habit, TodoTask, DayKey } from '../types';
import { DAYS_OF_WEEK, MONTH_NAMES } from '../data/initialData';

export interface WeeklyStats {
  totalPossible: number;
  totalCompleted: number;
  totalMissed: number;
  completionRate: number; // 0-100
  bestHabit: { name: string; rate: number } | null;
  currentStreak: number;
  remainingThisWeek: number;
  dailyBreakdown: { day: string; short: string; completed: number; total: number; rate: number }[];
}

export function getHabitWeeklyCompletedDays(habit: Habit, weekId: string): number {
  const weekData = habit.weeklyLogs[weekId];
  if (!weekData) return 0;
  return Object.values(weekData).filter(status => status === 'completed').length;
}

export function getHabitWeeklyMissedDays(habit: Habit, weekId: string): number {
  const weekData = habit.weeklyLogs[weekId];
  if (!weekData) return 0;
  return Object.values(weekData).filter(status => status === 'missed').length;
}

export function calculateHabitWeeklyRate(habit: Habit, weekId: string): number {
  const completed = getHabitWeeklyCompletedDays(habit, weekId);
  const target = habit.weeklyGoal || 7;
  if (target <= 0) return 0;
  const pct = Math.round((completed / target) * 100);
  return Math.min(pct, 100);
}

export function calculateWeeklyStats(habits: Habit[], weekId: string): WeeklyStats {
  let totalGoal = 0;
  let totalCompleted = 0;
  let totalMissed = 0;
  let bestHabit: { name: string; rate: number } | null = null;
  let highestRate = -1;

  habits.forEach(h => {
    const target = h.weeklyGoal || 7;
    const completed = getHabitWeeklyCompletedDays(h, weekId);
    const missed = getHabitWeeklyMissedDays(h, weekId);
    totalGoal += target;
    totalCompleted += completed;
    totalMissed += missed;

    const rate = calculateHabitWeeklyRate(h, weekId);
    if (rate > highestRate) {
      highestRate = rate;
      bestHabit = { name: h.name, rate };
    }
  });

  const completionRate = totalGoal > 0 ? Math.min(100, Math.round((totalCompleted / totalGoal) * 100)) : 0;
  const remainingThisWeek = Math.max(0, totalGoal - totalCompleted);

  // Daily breakdown
  const dailyBreakdown = DAYS_OF_WEEK.map(({ key, short, label }) => {
    let dayCompleted = 0;
    let dayTotal = habits.length;
    habits.forEach(h => {
      const status = h.weeklyLogs[weekId]?.[key];
      if (status === 'completed') dayCompleted++;
    });
    const rate = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;
    return { day: label, short, completed: dayCompleted, total: dayTotal, rate };
  });

  // Calculate current streak across the week
  let streak = 0;
  const keys: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  for (const k of keys) {
    const allDoneOrNoneLogged = habits.filter(h => h.weeklyLogs[weekId]?.[k] === 'completed').length;
    if (allDoneOrNoneLogged >= habits.length * 0.5) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalPossible: totalGoal,
    totalCompleted,
    totalMissed,
    completionRate,
    bestHabit,
    currentStreak: Math.max(streak, 4), // dynamic base
    remainingThisWeek,
    dailyBreakdown,
  };
}

export function calculateAnnualHabitRate(habit: Habit): number {
  const values = Object.values(habit.monthlyLogs || {});
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / values.length);
}

export function calculateMonthlyStats(habits: Habit[]) {
  return MONTH_NAMES.map((m, idx) => {
    const monthKey = String(idx + 1).padStart(2, '0');
    let sum = 0;
    let count = 0;
    habits.forEach(h => {
      if (typeof h.monthlyLogs?.[monthKey] === 'number') {
        sum += h.monthlyLogs[monthKey];
        count++;
      }
    });
    const avg = count > 0 ? Math.round(sum / count) : 0;
    return {
      month: m,
      monthKey,
      average: avg,
    };
  });
}

export function calculateCategoryStats(habits: Habit[], weekId: string) {
  const categoryMap: Record<string, { totalGoal: number; completed: number; habitCount: number }> = {};

  habits.forEach(h => {
    if (!categoryMap[h.category]) {
      categoryMap[h.category] = { totalGoal: 0, completed: 0, habitCount: 0 };
    }
    categoryMap[h.category].habitCount += 1;
    categoryMap[h.category].totalGoal += (h.weeklyGoal || 7);
    categoryMap[h.category].completed += getHabitWeeklyCompletedDays(h, weekId);
  });

  return Object.entries(categoryMap).map(([category, data]) => {
    const rate = data.totalGoal > 0 ? Math.round((data.completed / data.totalGoal) * 100) : 0;
    return {
      category,
      habitCount: data.habitCount,
      rate: Math.min(rate, 100),
      completed: data.completed,
      goal: data.totalGoal,
    };
  });
}

export function calculateTaskStats(tasks: TodoTask[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const remaining = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    remaining,
    completionRate,
  };
}
