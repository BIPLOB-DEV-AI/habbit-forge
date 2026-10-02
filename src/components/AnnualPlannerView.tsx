import React, { useState } from 'react';
import { Habit, PlannerProfile, HabitCategory } from '../types';
import { MONTH_NAMES, CATEGORIES } from '../data/initialData';
import { calculateAnnualHabitRate, calculateMonthlyStats } from '../utils/calculations';
import { CalloutBox } from './ui/CalloutBox';
import { MonthlyTrendChart } from './ui/Charts';
import {
  Plus,
  Calendar,
  Layers,
  Flag,
  Zap,
  Calculator,
  User,
  CheckCircle,
  FileText,
  Target,
  Sparkles,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

interface AnnualPlannerViewProps {
  habits: Habit[];
  profile: PlannerProfile;
  onUpdateProfile: (profile: PlannerProfile) => void;
  onUpdateMonthlyValue: (habitId: string, monthKey: string, value: number) => void;
  onOpenAddHabit: () => void;
  onExportExcel?: () => void;
  onExportWord?: () => void;
}

export const AnnualPlannerView: React.FC<AnnualPlannerViewProps> = ({
  habits,
  profile,
  onUpdateProfile,
  onUpdateMonthlyValue,
  onOpenAddHabit,
  onExportExcel,
  onExportWord,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingGoalMonth, setEditingGoalMonth] = useState<string>('OCT');
  const [newGoalInput, setNewGoalInput] = useState('');

  const monthlyStats = calculateMonthlyStats(habits);

  const dailyCount = habits.filter((h) => h.frequency === 'daily').length;
  const weeklyCount = habits.filter((h) => h.frequency === 'weekly').length;
  const monthlyCount = habits.filter((h) => h.frequency === 'monthly').length;
  const totalCount = habits.length;

  const filteredHabits = habits.filter((h) => {
    return selectedCategory === 'All' || h.category === selectedCategory;
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProfile({ ...profile, name: e.target.value });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateProfile({ ...profile, startDate: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateProfile({ ...profile, notes: e.target.value });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;

    const currentGoals = profile.monthlyGoals[editingGoalMonth] || [];
    const updatedGoals = [...currentGoals, newGoalInput.trim()];

    onUpdateProfile({
      ...profile,
      monthlyGoals: {
        ...profile.monthlyGoals,
        [editingGoalMonth]: updatedGoals,
      },
    });
    setNewGoalInput('');
  };

  const handleRemoveGoal = (monthKey: string, indexToRemove: number) => {
    const currentGoals = profile.monthlyGoals[monthKey] || [];
    const updatedGoals = currentGoals.filter((_, idx) => idx !== indexToRemove);

    onUpdateProfile({
      ...profile,
      monthlyGoals: {
        ...profile.monthlyGoals,
        [monthKey]: updatedGoals,
      },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              HABIT FORGE
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">365-Day Master Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Habit Planner
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-blue-700 uppercase tracking-wider mt-1">
            Set up once and track habits across 12 months.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-end">
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="px-2.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              title="Download 12-month habit planner as Excel file (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Excel</span>
            </button>
          )}

          {onExportWord && (
            <button
              onClick={onExportWord}
              className="px-2.5 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              title="Download 12-month habit planner as Word file (.docx)"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Word</span>
            </button>
          )}

          <button
            onClick={onOpenAddHabit}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Annual Habit</span>
          </button>
        </div>
      </div>

      {/* Profile & Name Section (Clean printable style) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          <User className="w-3.5 h-3.5 text-blue-700" />
          <span>Planner Ownership & Timeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Name:
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              className="w-full px-3 py-2 text-sm bg-slate-50 border-b-2 border-slate-300 focus:border-blue-700 focus:bg-white focus:outline-none transition-colors font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Start Date:
            </label>
            <input
              type="date"
              value={profile.startDate}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border-b-2 border-slate-300 focus:border-blue-700 focus:bg-white focus:outline-none transition-colors font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Yearly Vision:
            </label>
            <input
              type="text"
              value={profile.vision}
              onChange={(e) => onUpdateProfile({ ...profile, vision: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border-b-2 border-slate-300 focus:border-blue-700 focus:bg-white focus:outline-none transition-colors font-medium text-slate-900 truncate"
            />
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            DAILY HABITS
          </span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums block mt-2">
            {dailyCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">365-day cadence</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            WEEKLY HABITS
          </span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums block mt-2">
            {weeklyCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">52 weekly cycles</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            MONTHLY HABITS
          </span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums block mt-2">
            {monthlyCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">12 milestone checkpoints</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
            TOTAL HABITS
          </span>
          <span className="text-2xl font-extrabold text-blue-700 tabular-nums block mt-2">
            {totalCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Active routines tracked</span>
        </div>
      </div>

      {/* 5 Feature Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <CalloutBox
          title="ADD THE HABITS"
          description="Add the habits you want to track."
          icon={Plus}
        />
        <CalloutBox
          title="CATEGORIZE DAILY"
          description="Organize habits into simple categories."
          icon={Layers}
        />
        <CalloutBox
          title="SET GOALS"
          description="Create measurable goals for each month."
          icon={Flag}
        />
        <CalloutBox
          title="CARRY YOUR STREAK"
          description="Keep your momentum from month to month."
          icon={Zap}
        />
        <CalloutBox
          title="AUTOMATICALLY CALCULATES"
          description="Automatically calculate monthly and annual totals."
          icon={Calculator}
        />
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 bg-white border border-slate-200 rounded-xl shadow-2xs scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            selectedCategory === 'All'
              ? 'bg-blue-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Categories ({habits.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-700 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 12-Month Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              12-Month Habit Completion Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any percentage cell to adjust monthly rate (0-100%)
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-700">
            Auto-calculated averages
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[170px]">HABIT</th>
                <th className="py-3 px-3 min-w-[90px]">CATEGORY</th>
                {MONTH_NAMES.map((m) => (
                  <th key={m} className="py-3 px-1.5 text-center min-w-[50px]">
                    {m}
                  </th>
                ))}
                <th className="py-3 px-3 text-right min-w-[90px] bg-blue-50/50 text-blue-900">
                  ANNUAL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHabits.map((habit) => {
                const annualAvg = calculateAnnualHabitRate(habit);

                return (
                  <tr key={habit.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Habit Name */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{habit.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal capitalize">
                        {habit.frequency} · target: {habit.weeklyGoal}d/wk
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {habit.category}
                    </td>

                    {/* JAN - DEC cells */}
                    {MONTH_NAMES.map((_, idx) => {
                      const monthKey = String(idx + 1).padStart(2, '0');
                      const val = habit.monthlyLogs?.[monthKey] ?? 0;
                      const isHigh = val >= 90;
                      const isMed = val >= 75 && val < 90;

                      return (
                        <td key={monthKey} className="py-2.5 px-1 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={val}
                            onChange={(e) =>
                              onUpdateMonthlyValue(
                                habit.id,
                                monthKey,
                                Math.min(100, Math.max(0, Number(e.target.value)))
                              )
                            }
                            className={`w-11 py-1 text-center font-bold text-xs rounded-md border transition-all tabular-nums ${
                              isHigh
                                ? 'bg-blue-50/90 text-blue-800 border-blue-200'
                                : isMed
                                ? 'bg-slate-50 text-slate-800 border-slate-200'
                                : 'bg-white text-slate-600 border-slate-200'
                            } focus:outline-none focus:ring-1 focus:ring-blue-600`}
                          />
                        </td>
                      );
                    })}

                    {/* Annual Avg */}
                    <td className="py-3 px-3 text-right bg-blue-50/30 font-bold text-blue-700 tabular-nums">
                      {annualAvg}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer with Monthly Averages */}
            <tfoot>
              <tr className="bg-slate-100/70 border-t-2 border-slate-200 font-bold text-[11px] text-slate-700">
                <td className="py-3 px-4 uppercase">Monthly Average</td>
                <td className="py-3 px-3 text-slate-400">All</td>
                {monthlyStats.map((stat) => (
                  <td key={stat.monthKey} className="py-3 px-1.5 text-center text-blue-800 tabular-nums">
                    {stat.average}%
                  </td>
                ))}
                <td className="py-3 px-3 text-right text-blue-900 tabular-nums">
                  {Math.round(
                    monthlyStats.reduce((acc, c) => acc + c.average, 0) / (monthlyStats.length || 1)
                  )}
                  %
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Monthly Progress Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <MonthlyTrendChart data={monthlyStats} />
      </div>

      {/* Secondary Sections: MONTHLY GOALS, MONTHLY HABITS, WEEKLY HABITS, NOTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: MONTHLY GOALS */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  MONTHLY GOALS
                </h3>
              </div>
              <select
                value={editingGoalMonth}
                onChange={(e) => setEditingGoalMonth(e.target.value)}
                className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 focus:outline-none"
              >
                {MONTH_NAMES.map((m) => (
                  <option key={m} value={m}>
                    Month: {m}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Key milestone commitments for {editingGoalMonth} {profile.year}:
            </p>

            <div className="space-y-2 mb-4">
              {(profile.monthlyGoals[editingGoalMonth] || []).map((goal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                    <span>{goal}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveGoal(editingGoalMonth, idx)}
                    className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    title="Remove goal"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddGoal} className="flex gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder={`Add goal for ${editingGoalMonth}...`}
              value={newGoalInput}
              onChange={(e) => setNewGoalInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
            >
              Add
            </button>
          </form>
        </div>

        {/* Section 2: NOTES & ANNUAL REVIEW */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <FileText className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                PLANNER NOTES & PROTOCOL
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-2">
              Annual reflection rules, identity statements, and consistency cues:
            </p>

            <textarea
              rows={5}
              value={profile.notes}
              onChange={handleNotesChange}
              placeholder="Write your personal habit notes, triggers, or quarterly reflections..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 leading-relaxed resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Changes persist automatically</span>
            <span className="font-semibold text-blue-700">Habit Forge 2026 Edition</span>
          </div>
        </div>
      </div>
    </div>
  );
};
