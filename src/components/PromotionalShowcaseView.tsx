import React, { useState } from 'react';
import { Habit, TodoTask, PlannerProfile } from '../types';
import { DAYS_OF_WEEK, MONTH_NAMES } from '../data/initialData';
import { calculateHabitWeeklyRate, calculateWeeklyStats, getHabitWeeklyCompletedDays } from '../utils/calculations';
import {
  Sparkles,
  CheckCircle,
  Trophy,
  Target,
  Eye,
  Calendar,
  Layers,
  Flag,
  Zap,
  Calculator,
  Tag,
  CheckCircle2,
  BarChart2,
  Plus,
  ExternalLink,
} from 'lucide-react';

interface PromotionalShowcaseViewProps {
  habits: Habit[];
  tasks: TodoTask[];
  profile: PlannerProfile;
  onNavigateToTab: (tab: 'weekly' | 'annual' | 'todo') => void;
}

export const PromotionalShowcaseView: React.FC<PromotionalShowcaseViewProps> = ({
  habits,
  tasks,
  profile,
  onNavigateToTab,
}) => {
  const [activePreviewPage, setActivePreviewPage] = useState<1 | 2 | 3>(1);

  const previewHabits = habits.slice(0, 8);
  const previewTasks = tasks.slice(0, 8);
  const weeklyStats = calculateWeeklyStats(habits, '2026-W40');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header and Page Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              COMMERCIAL SHOWCASE
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Digital Product Showcase</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Etsy & Gumroad Product Previews
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Studio-grade promotional display cards engineered for digital product marketplaces.
          </p>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <button
            onClick={() => setActivePreviewPage(1)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activePreviewPage === 1
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Page 1: Weekly Habits
          </button>
          <button
            onClick={() => setActivePreviewPage(2)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activePreviewPage === 2
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Page 2: Habit Planner
          </button>
          <button
            onClick={() => setActivePreviewPage(3)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activePreviewPage === 3
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Page 3: To Do List
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* PAGE 1: WEEKLY HABITS SHOWCASE */}
      {/* ================================================== */}
      {activePreviewPage === 1 && (
        <div className="bg-slate-100/80 p-4 sm:p-8 rounded-3xl border border-slate-300/80 shadow-md">
          {/* Main Poster Container */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Poster Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  HF
                </div>
                <span className="text-base font-black tracking-widest text-slate-900">
                  HABIT FORGE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Weekly Habits
              </h2>
              <p className="text-sm font-bold tracking-widest uppercase text-blue-700 mt-2">
                STAY CONSISTENT WITH WEEKLY ROUTINES
              </p>
            </div>

            {/* Top 5 Callout Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Target className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  SET CLEAR TARGETS
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Define weekly goals
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Trophy className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  TRACK WEEKLY WINS
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Monthly progress
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <CheckCircle className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  STAY ACCOUNTABLE
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Tick habits complete
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Eye className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  SEE THE BIGGER PICTURE
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  All routines combined
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center col-span-2 sm:col-span-1">
                <Calendar className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  STAY ON PACE
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Goal pace & weeks left
                </div>
              </div>
            </div>

            {/* Screenshot-Style Center Table Mockup */}
            <div className="rounded-xl border border-slate-300 shadow-lg overflow-hidden bg-white mb-8">
              <div className="bg-slate-900 text-white px-4 py-2 text-xs flex justify-between items-center font-mono">
                <span>HABIT FORGE // WEEKLY ROUTINE MATRIX</span>
                <span className="text-emerald-400">STATUS: {weeklyStats.completionRate}% OPTIMAL</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase">
                      <th className="py-2.5 px-3">HABIT</th>
                      {DAYS_OF_WEEK.map((d) => (
                        <th key={d.key} className="py-2.5 px-1 text-center w-10">
                          {d.short}
                        </th>
                      ))}
                      <th className="py-2.5 px-2 text-center w-16">GOAL</th>
                      <th className="py-2.5 px-3 text-right">COMPLETION %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewHabits.map((h) => {
                      const completedCount = getHabitWeeklyCompletedDays(h, '2026-W40');
                      const rate = calculateHabitWeeklyRate(h, '2026-W40');
                      return (
                        <tr key={h.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-900">
                            {h.name}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {h.category}
                            </span>
                          </td>
                          {DAYS_OF_WEEK.map((d) => {
                            const status = h.weeklyLogs['2026-W40']?.[d.key];
                            return (
                              <td key={d.key} className="py-1.5 px-1 text-center">
                                {status === 'completed' ? (
                                  <span className="w-6 h-6 rounded bg-emerald-600 text-white inline-flex items-center justify-center font-bold text-[10px]">
                                    ✓
                                  </span>
                                ) : status === 'missed' ? (
                                  <span className="w-6 h-6 rounded bg-rose-100 text-rose-700 inline-flex items-center justify-center font-bold text-[10px]">
                                    ✗
                                  </span>
                                ) : (
                                  <span className="w-6 h-6 rounded border border-slate-200 text-slate-300 inline-flex items-center justify-center text-[9px]">
                                    ·
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td className="py-2 px-2 text-center font-bold text-slate-700">
                            {completedCount}/{h.weeklyGoal}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className="font-bold text-blue-700 tabular-nums">
                              {rate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Feature Bar */}
            <div className="bg-slate-900 text-white rounded-xl py-3 px-4 text-center font-bold text-xs uppercase tracking-wider flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <span>SIMPLE & POWERFUL</span>
              <span className="text-slate-600">|</span>
              <span>AUTOMATED TRACKING</span>
              <span className="text-slate-600">|</span>
              <span>WORKS ON ALL DEVICES</span>
              <span className="text-slate-600">|</span>
              <span>AUTO UPDATES</span>
            </div>

            {/* Jump to Active Tool CTA */}
            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigateToTab('weekly')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Open Interactive Weekly Tracker</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* PAGE 2: 12-MONTH HABIT PLANNER SHOWCASE */}
      {/* ================================================== */}
      {activePreviewPage === 2 && (
        <div className="bg-slate-100/80 p-4 sm:p-8 rounded-3xl border border-slate-300/80 shadow-md">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Poster Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  HF
                </div>
                <span className="text-base font-black tracking-widest text-slate-900">
                  HABIT FORGE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Habit Planner
              </h2>
              <p className="text-sm font-bold tracking-widest text-blue-700 mt-2">
                Set up once and track habits across 12 months.
              </p>
            </div>

            {/* 5 Callouts */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Plus className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  ADD THE HABITS
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Track what matters
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Layers className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  CATEGORIZE DAILY
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Simple categories
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Flag className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  SET GOALS
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Monthly milestones
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Zap className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  CARRY YOUR STREAK
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Month-to-month pace
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center col-span-2 sm:col-span-1">
                <Calculator className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  AUTOMATICALLY CALCULATES
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Monthly & annual totals
                </div>
              </div>
            </div>

            {/* 12-Month Grid Mockup */}
            <div className="rounded-xl border border-slate-300 shadow-lg overflow-hidden bg-white mb-8">
              <div className="bg-slate-900 text-white px-4 py-2 text-xs flex justify-between items-center font-mono">
                <span>HABIT FORGE // 365-DAY ANNUAL MASTER PLANNER</span>
                <span className="text-blue-300">USER: {profile.name}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase">
                      <th className="py-2.5 px-3">HABIT</th>
                      <th className="py-2.5 px-2">CATEGORY</th>
                      {MONTH_NAMES.map((m) => (
                        <th key={m} className="py-2.5 px-1 text-center w-8">
                          {m}
                        </th>
                      ))}
                      <th className="py-2.5 px-2 text-right">AVG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewHabits.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">
                          {h.name}
                        </td>
                        <td className="py-2 px-2 text-slate-500 text-[11px]">
                          {h.category}
                        </td>
                        {MONTH_NAMES.map((_, idx) => {
                          const monthKey = String(idx + 1).padStart(2, '0');
                          const val = h.monthlyLogs?.[monthKey] || 85;
                          return (
                            <td key={monthKey} className="py-2 px-1 text-center font-semibold text-slate-700 tabular-nums">
                              {val}%
                            </td>
                          );
                        })}
                        <td className="py-2 px-2 text-right font-bold text-blue-700 tabular-nums">
                          91%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-900 text-white rounded-xl py-3 px-4 text-center font-bold text-xs uppercase tracking-wider flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <span>TRACK HABITS EASILY</span>
              <span className="text-slate-600">|</span>
              <span>STAY CONSISTENT</span>
              <span className="text-slate-600">|</span>
              <span>ACHIEVE YOUR GOALS</span>
              <span className="text-slate-600">|</span>
              <span>SEE REAL PROGRESS</span>
            </div>

            {/* CTA */}
            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigateToTab('annual')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Open 12-Month Habit Planner</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* PAGE 3: TO DO LIST SHOWCASE */}
      {/* ================================================== */}
      {activePreviewPage === 3 && (
        <div className="bg-slate-100/80 p-4 sm:p-8 rounded-3xl border border-slate-300/80 shadow-md">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Poster Header */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                  HF
                </div>
                <span className="text-base font-black tracking-widest text-slate-900">
                  HABIT FORGE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                To Do List
              </h2>
              <p className="text-sm font-bold tracking-widest uppercase text-blue-700 mt-2">
                STAY ORGANIZED AND GET THINGS DONE
              </p>
            </div>

            {/* Callouts + Large BONUS Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8 items-stretch">
              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <CheckCircle2 className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  COMPLETE TASKS
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Tick tasks when completed
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Plus className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  ADD TASKS
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Quickly add to-dos
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <Tag className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  STAY ORGANIZED
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Separate by categories
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-blue-100 text-center">
                <BarChart2 className="w-4 h-4 mx-auto text-blue-700 mb-1" />
                <div className="text-[11px] font-bold text-slate-900 uppercase">
                  TRACK PROGRESS
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Auto progress math
                </div>
              </div>

              {/* Large BONUS Badge */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white text-center flex flex-col justify-center shadow-xs">
                <div className="text-[10px] font-black uppercase tracking-widest bg-white/20 py-0.5 px-2 rounded mx-auto mb-1 text-blue-100">
                  BONUS
                </div>
                <div className="text-xs font-bold leading-tight">
                  Build habits.<br />Complete more.<br />Achieve more.
                </div>
              </div>
            </div>

            {/* Task List Center Mockup */}
            <div className="rounded-xl border border-slate-300 shadow-lg overflow-hidden bg-white mb-8">
              <div className="bg-slate-900 text-white px-4 py-2 text-xs flex justify-between items-center font-mono">
                <span>HABIT FORGE // HIGH-PRIORITY ACTION QUEUE</span>
                <span className="text-emerald-400">STATUS: ACTIVE</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase">
                      <th className="py-2.5 px-3 w-10 text-center">DONE</th>
                      <th className="py-2.5 px-3">TASK</th>
                      <th className="py-2.5 px-2">CATEGORY</th>
                      <th className="py-2.5 px-2">PRIORITY</th>
                      <th className="py-2.5 px-2">STATUS</th>
                      <th className="py-2.5 px-3 text-right">DUE DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewTasks.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`w-5 h-5 rounded inline-flex items-center justify-center font-bold text-xs ${
                              t.done
                                ? 'bg-emerald-600 text-white'
                                : 'border border-slate-300 text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                        </td>
                        <td
                          className={`py-2 px-3 font-semibold ${
                            t.done ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {t.task}
                        </td>
                        <td className="py-2 px-2 text-slate-500 text-[11px]">
                          {t.category}
                        </td>
                        <td className="py-2 px-2 font-bold text-[11px] text-blue-700">
                          {t.priority}
                        </td>
                        <td className="py-2 px-2 font-semibold text-[11px] text-slate-700">
                          {t.done ? 'Completed' : t.status}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-500 tabular-nums">
                          {t.dueDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-900 text-white rounded-xl py-3 px-4 text-center font-bold text-xs uppercase tracking-wider flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <span>STAY ORGANIZED</span>
              <span className="text-slate-600">|</span>
              <span>GET THINGS DONE</span>
              <span className="text-slate-600">|</span>
              <span>TRACK PROGRESS</span>
              <span className="text-slate-600">|</span>
              <span>BONUS INCLUDED</span>
            </div>

            {/* CTA */}
            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigateToTab('todo')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Open Interactive To Do List</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
