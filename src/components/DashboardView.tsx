import React from 'react';
import { Habit, TodoTask, DayKey } from '../types';
import { calculateWeeklyStats, calculateMonthlyStats, calculateTaskStats } from '../utils/calculations';
import { CURRENT_WEEK_ID, DAYS_OF_WEEK } from '../data/initialData';
import { CircularProgress } from './ui/CircularProgress';
import { WeeklyBarChart, MonthlyTrendChart } from './ui/Charts';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  Download,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

interface DashboardViewProps {
  habits: Habit[];
  tasks: TodoTask[];
  onToggleHabitToday: (habitId: string) => void;
  onNavigateTab: (tab: 'weekly' | 'annual' | 'todo' | 'stats') => void;
  onOpenAddHabit: () => void;
  onExportExcel: () => void;
  onExportWord: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  habits,
  tasks,
  onToggleHabitToday,
  onNavigateTab,
  onOpenAddHabit,
  onExportExcel,
  onExportWord,
}) => {
  // Current day of week key based on system date or Friday default in sample
  const todayKey: DayKey = 'fri';

  const weeklyStats = calculateWeeklyStats(habits, CURRENT_WEEK_ID);
  const monthlyStats = calculateMonthlyStats(habits);
  const taskStats = calculateTaskStats(tasks);

  // Dynamic counts
  const dailyHabitsCount = habits.filter((h) => h.frequency === 'daily').length;
  const weeklyHabitsCount = habits.filter((h) => h.frequency === 'weekly').length;
  const monthlyHabitsCount = habits.filter((h) => h.frequency === 'monthly').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              HABIT FORGE
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Executive Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Habit Planner Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time consistency metrics, weekly tracking cadences, and monthly performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportExcel}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            title="Convert and download spreadsheet as Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Excel (.xlsx)</span>
          </button>
          <button
            onClick={onExportWord}
            className="px-3.5 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            title="Convert and download formatted document as Word (.docx)"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Word (.docx)</span>
          </button>
          <button
            onClick={() => onNavigateTab('weekly')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <span>Open Weekly Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenAddHabit}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Easy Access Export Notice */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-slate-50 to-emerald-50/50 border border-blue-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Offline Access & Easy File Conversion
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instantly export your habits, 12-month ledger, and tasks into standard Microsoft Excel (.xlsx) or Microsoft Word (.docx) files.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={onExportExcel}
            className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download Excel</span>
          </button>
          <button
            onClick={onExportWord}
            className="px-3 py-1.5 text-xs font-bold text-blue-800 bg-white hover:bg-blue-50 border border-blue-300 rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Word</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Daily Habits */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              DAILY HABITS
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {dailyHabitsCount}
              </span>
              <span className="text-xs text-slate-500">routines</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Active everyday focus areas
            </div>
          </div>
        </div>

        {/* Card 2: Weekly Habits */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              WEEKLY HABITS
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {weeklyHabitsCount}
              </span>
              <span className="text-xs text-slate-500">routines</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Scheduled milestone cadences
            </div>
          </div>
        </div>

        {/* Card 3: Monthly Habits */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              MONTHLY HABITS
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {monthlyHabitsCount}
              </span>
              <span className="text-xs text-slate-500">milestones</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              High-level strategic audits
            </div>
          </div>
        </div>

        {/* Card 4: Overall Completion % */}
        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              OVERALL COMPLETION %
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold text-blue-700 tabular-nums">
                {weeklyStats.completionRate}%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {weeklyStats.totalCompleted} of {weeklyStats.totalPossible} goals met
              </div>
            </div>
            <div className="shrink-0 scale-75 origin-right">
              <CircularProgress value={weeklyStats.completionRate} size={64} strokeWidth={6} />
            </div>
          </div>
        </div>
      </div>

      {/* Core Performance Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900 text-white shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Current Streak
            </div>
            <div className="text-xl font-extrabold text-white tabular-nums">
              {weeklyStats.currentStreak} Days
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Best Habit
            </div>
            <div className="text-sm font-bold text-white truncate max-w-[130px]">
              {weeklyStats.bestHabit ? weeklyStats.bestHabit.name : 'Morning Routine'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Completed
            </div>
            <div className="text-xl font-extrabold text-white tabular-nums">
              {weeklyStats.totalCompleted}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Remaining Habits
            </div>
            <div className="text-xl font-extrabold text-white tabular-nums">
              {weeklyStats.remainingThisWeek}
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Charts: Weekly Completion & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weekly Completion Chart
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily execution breakdown for the active week
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md tabular-nums">
              {weeklyStats.completionRate}% Avg
            </span>
          </div>

          <div className="py-4">
            <WeeklyBarChart data={weeklyStats.dailyBreakdown} targetRate={85} />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Goal: 85% minimum daily consistency</span>
            <button
              onClick={() => onNavigateTab('weekly')}
              className="font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Monthly Progress Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Progress Chart
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Annual continuity across all 12 calendar months
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">
              2026 Year-to-Date
            </span>
          </div>

          <div className="py-4">
            <MonthlyTrendChart data={monthlyStats} />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tracking 14 total core habits year-round</span>
            <button
              onClick={() => onNavigateTab('annual')}
              className="font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Open 12-month planner</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Circular Progress & Quick Today Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Completion Percentage Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Weekly Habit Completion
          </h3>
          <p className="text-xs text-slate-500 mb-6 max-w-xs">
            Overall percentage of targets met for the current 7-day routine cycle
          </p>

          <CircularProgress
            value={weeklyStats.completionRate}
            size={140}
            strokeWidth={12}
            sublabel="Overall"
          />

          <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-5 border-t border-slate-100 text-left">
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Completed
              </span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {weeklyStats.totalCompleted} days
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Target Pool
              </span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {weeklyStats.totalPossible} days
              </span>
            </div>
          </div>
        </div>

        {/* Quick Log For Today */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Today's Habit Checklist (Friday)
              </h3>
              <p className="text-xs text-slate-500">
                Click to tick complete (✓) or toggle status in real time
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('weekly')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Full Grid →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
            {habits.map((habit) => {
              const status = habit.weeklyLogs[CURRENT_WEEK_ID]?.[todayKey] || 'empty';
              const isCompleted = status === 'completed';
              const isMissed = status === 'missed';

              return (
                <div
                  key={habit.id}
                  onClick={() => onToggleHabitToday(habit.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCompleted
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : isMissed
                      ? 'bg-rose-50/40 border-rose-200 text-rose-950'
                      : 'bg-slate-50 border-slate-200/80 hover:border-blue-300'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold truncate">
                        {habit.name}
                      </span>
                      <span className="text-[10px] text-slate-400">· {habit.category}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {habit.notes || `Goal: ${habit.weeklyGoal} days/wk`}
                    </span>
                  </div>

                  <div className="shrink-0">
                    {isCompleted ? (
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        ✓
                      </div>
                    ) : isMissed ? (
                      <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                        ✗
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-600 flex items-center justify-center text-xs text-slate-400">
                        ○
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
