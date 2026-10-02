import React, { useState } from 'react';
import { Habit, DayKey, DayStatus } from '../types';
import { DAYS_OF_WEEK, CURRENT_WEEK_ID } from '../data/initialData';
import {
  calculateHabitWeeklyRate,
  calculateWeeklyStats,
  getHabitWeeklyCompletedDays,
} from '../utils/calculations';
import { CalloutBox } from './ui/CalloutBox';
import {
  Target,
  Trophy,
  CheckCircle,
  Eye,
  Calendar,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Check,
  X as XIcon,
  Download,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

interface WeeklyHabitsViewProps {
  habits: Habit[];
  onUpdateHabitDay: (habitId: string, day: DayKey, status: DayStatus) => void;
  onUpdateHabitGoal: (habitId: string, newGoal: number) => void;
  onDeleteHabit: (habitId: string) => void;
  onOpenAddHabit: () => void;
  onExportExcel?: () => void;
  onExportWord?: () => void;
}

export const WeeklyHabitsView: React.FC<WeeklyHabitsViewProps> = ({
  habits,
  onUpdateHabitDay,
  onUpdateHabitGoal,
  onDeleteHabit,
  onOpenAddHabit,
  onExportExcel,
  onExportWord,
}) => {
  const [selectedWeek, setSelectedWeek] = useState(CURRENT_WEEK_ID);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const weeklyStats = calculateWeeklyStats(habits, selectedWeek);

  // Filter habits
  const filteredHabits = habits.filter((h) => {
    const matchesCategory = categoryFilter === 'All' || h.category === categoryFilter;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cycle day status: empty -> completed -> missed -> empty
  const handleToggleDay = (habitId: string, day: DayKey, currentStatus: DayStatus) => {
    let nextStatus: DayStatus = 'completed';
    if (currentStatus === 'completed') nextStatus = 'missed';
    else if (currentStatus === 'missed') nextStatus = 'empty';
    else nextStatus = 'completed';

    onUpdateHabitDay(habitId, day, nextStatus);
  };

  // Top habits sorted by completion rate
  const sortedHabits = [...habits].sort((a, b) => {
    return calculateHabitWeeklyRate(b, selectedWeek) - calculateHabitWeeklyRate(a, selectedWeek);
  });
  const topHabits = sortedHabits.slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              HABIT FORGE
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Routine Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Weekly Habits
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-blue-700 mt-1">
            STAY CONSISTENT WITH WEEKLY ROUTINES
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Week Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent pr-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="2026-W40">Week 40 (Current Week)</option>
              <option value="2026-W39">Week 39 (Prior Week)</option>
              <option value="2026-W38">Week 38 (Prior Week)</option>
              <option value="2026-W41">Week 41 (Next Week)</option>
            </select>
          </div>

          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="px-2.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              title="Download weekly habit tracker as Excel file (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Excel</span>
            </button>
          )}

          {onExportWord && (
            <button
              onClick={onExportWord}
              className="px-2.5 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              title="Download as Word file (.docx)"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Word</span>
            </button>
          )}

          <button
            onClick={onOpenAddHabit}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* Top 5 Feature Callouts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <CalloutBox
          title="SET CLEAR TARGETS"
          description="Define weekly goals for each habit."
          icon={Target}
        />
        <CalloutBox
          title="TRACK WEEKLY WINS"
          description="See your progress across the month."
          icon={Trophy}
        />
        <CalloutBox
          title="STAY ACCOUNTABLE"
          description="Tick habits as you complete them."
          icon={CheckCircle}
        />
        <CalloutBox
          title="SEE THE BIGGER PICTURE"
          description="Track progress across all your routines."
          icon={Eye}
        />
        <CalloutBox
          title="STAY ON PACE"
          description="View goal completion and weeks left."
          icon={Calendar}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {['All', 'Health', 'Fitness', 'Learning', 'Productivity', 'Mindset', 'Finance'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Professional Habit-Tracking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 min-w-[200px]">HABIT</th>
                {DAYS_OF_WEEK.map((d) => (
                  <th key={d.key} className="py-3.5 px-2 text-center w-14">
                    <span className="block text-slate-900">{d.short}</span>
                    <span className="text-[9px] font-medium text-slate-400 capitalize">
                      {d.key === 'fri' ? 'Today' : d.label.slice(0, 3)}
                    </span>
                  </th>
                ))}
                <th className="py-3.5 px-3 text-center w-24">GOAL</th>
                <th className="py-3.5 px-4 text-right min-w-[120px]">COMPLETION %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredHabits.map((habit) => {
                const completedCount = getHabitWeeklyCompletedDays(habit, selectedWeek);
                const rate = calculateHabitWeeklyRate(habit, selectedWeek);
                const target = habit.weeklyGoal || 7;
                const isGoalMet = completedCount >= target;

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Habit Name & Category */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {habit.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span>{habit.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{habit.frequency}</span>
                            {habit.notes && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-slate-400 truncate max-w-[160px]">
                                  {habit.notes}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteHabit(habit.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 transition-opacity p-1 ml-2"
                          title="Delete habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Mon-Sun Checkboxes */}
                    {DAYS_OF_WEEK.map((d) => {
                      const status = habit.weeklyLogs[selectedWeek]?.[d.key] || 'empty';
                      const isCompleted = status === 'completed';
                      const isMissed = status === 'missed';

                      return (
                        <td key={d.key} className="py-2.5 px-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleDay(habit.id, d.key, status)}
                            title={`${habit.name} on ${d.label}: Click to toggle (Done/Missed/Clear)`}
                            className={`w-9 h-9 mx-auto rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                : isMissed
                                ? 'bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200'
                                : 'bg-slate-100/80 text-slate-400 border border-slate-200 hover:border-blue-400 hover:bg-white'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : isMissed ? (
                              <XIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <span className="text-[10px] text-slate-300 font-normal">·</span>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* Goal Column (Interactive) */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-xs font-semibold tabular-nums text-slate-700">
                        <span className={isGoalMet ? 'text-emerald-700 font-bold' : ''}>
                          {completedCount}
                        </span>
                        <span className="text-slate-400">/</span>
                        <select
                          value={target}
                          onChange={(e) => onUpdateHabitGoal(habit.id, Number(e.target.value))}
                          className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Completion % Column with Clean Blue Progress Bar */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold tabular-nums ${
                              rate === 100
                                ? 'text-emerald-700'
                                : rate >= 70
                                ? 'text-blue-700'
                                : 'text-slate-700'
                            }`}
                          >
                            {rate}%
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              rate === 100
                                ? 'bg-emerald-600'
                                : rate >= 70
                                ? 'bg-blue-600'
                                : 'bg-blue-400'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend / Status Helper */}
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                ✓
              </span>
              <span>Completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-[10px]">
                ✗
              </span>
              <span>Missed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 text-[10px]">
                ·
              </span>
              <span>Empty / Pending</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Tip: Click any cell to cycle through status
          </div>
        </div>
      </div>

      {/* Progress Section Below Table */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Box 1: Weekly Progress */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            WEEKLY PROGRESS
          </span>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-blue-700 tabular-nums">
              {weeklyStats.completionRate}%
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-blue-700 rounded-full transition-all duration-500"
                style={{ width: `${weeklyStats.completionRate}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {weeklyStats.totalCompleted} of {weeklyStats.totalPossible} targets executed
          </div>
        </div>

        {/* Box 2: Top Habits */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            TOP HABITS
          </span>
          <div className="space-y-1.5 my-2">
            {topHabits.map((h, i) => {
              const r = calculateHabitWeeklyRate(h, selectedWeek);
              return (
                <div key={h.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                    {i + 1}. {h.name}
                  </span>
                  <span className="text-blue-700 font-bold tabular-nums">{r}%</span>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-400">
            Ranked by consistency
          </div>
        </div>

        {/* Box 3: Total Completed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            TOTAL COMPLETED
          </span>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {weeklyStats.totalCompleted}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Actions successfully checked
            </div>
          </div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>High consistency week</span>
          </div>
        </div>

        {/* Box 4: Current Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              CURRENT STREAK
            </span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-white tabular-nums">
              {weeklyStats.currentStreak} Days
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Active consecutive momentum
            </div>
          </div>
          <div className="text-[11px] text-blue-300">
            Keep your chain unbroken
          </div>
        </div>
      </div>
    </div>
  );
};
