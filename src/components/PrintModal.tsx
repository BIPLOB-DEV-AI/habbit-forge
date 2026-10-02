import React, { useState } from 'react';
import { X, Printer, Check, Download } from 'lucide-react';
import { Habit, TodoTask, PlannerProfile } from '../types';
import { DAYS_OF_WEEK, MONTH_NAMES } from '../data/initialData';
import { getHabitWeeklyCompletedDays, calculateHabitWeeklyRate } from '../utils/calculations';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  tasks: TodoTask[];
  profile: PlannerProfile;
  onExportExcel: () => void;
  onExportWord: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  habits,
  tasks,
  profile,
  onExportExcel,
  onExportWord,
}) => {
  const [printLayout, setPrintLayout] = useState<'weekly' | 'annual' | 'todo'>('weekly');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 relative max-h-[92vh] flex flex-col">
        {/* Header Controls (no-print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
              HF
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Print & PDF Export Preview
              </h3>
              <p className="text-xs text-slate-500">
                Ready-to-print digital planner template optimized for A4 / US Letter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setPrintLayout('weekly')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  printLayout === 'weekly' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Weekly Sheet
              </button>
              <button
                onClick={() => setPrintLayout('annual')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  printLayout === 'annual' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                12-Month Sheet
              </button>
              <button
                onClick={() => setPrintLayout('todo')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  printLayout === 'todo' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                To-Do Sheet
              </button>
            </div>

            <button
              onClick={onExportExcel}
              className="px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              title="Download entire planner as an Excel spreadsheet (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Excel (.xlsx)</span>
            </button>

            <button
              onClick={onExportWord}
              className="px-3 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              title="Download formatted planner as a Word document (.docx)"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              <span>Word (.docx)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas Preview */}
        <div className="flex-1 overflow-y-auto py-6 px-2">
          <div className="bg-white border-2 border-slate-300 rounded-xl p-8 max-w-3xl mx-auto shadow-sm text-slate-900 print-container">
            {/* Planner Header */}
            <div className="flex justify-between items-start pb-6 border-b-2 border-blue-900 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs">
                    HF
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    HABIT FORGE
                  </h1>
                </div>
                <div className="text-[10px] font-bold text-blue-800 tracking-widest uppercase mt-0.5">
                  BUILD BETTER. EVERY DAY.
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="font-bold text-slate-900">Name: {profile.name}</div>
                <div className="text-slate-500 mt-0.5">Start Date: {profile.startDate}</div>
                <div className="text-blue-700 font-semibold text-[11px] mt-0.5">Year: {profile.year}</div>
              </div>
            </div>

            {/* Layout 1: Weekly */}
            {printLayout === 'weekly' && (
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                    Weekly Habit Tracker
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">Week: ________ / 52</span>
                </div>

                <table className="w-full border-collapse border border-slate-300 text-xs mb-6">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                      <th className="border border-slate-300 p-2 text-left">HABIT</th>
                      {DAYS_OF_WEEK.map((d) => (
                        <th key={d.key} className="border border-slate-300 p-2 text-center w-10">
                          {d.short}
                        </th>
                      ))}
                      <th className="border border-slate-300 p-2 text-center w-14">GOAL</th>
                      <th className="border border-slate-300 p-2 text-center w-16">RESULT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((h) => {
                      const completedCount = getHabitWeeklyCompletedDays(h, '2026-W40');
                      const rate = calculateHabitWeeklyRate(h, '2026-W40');
                      return (
                        <tr key={h.id} className="border-b border-slate-200">
                          <td className="border border-slate-300 p-2 font-semibold">
                            {h.name}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {h.category} · {h.frequency}
                            </span>
                          </td>
                          {DAYS_OF_WEEK.map((d) => {
                            const status = h.weeklyLogs['2026-W40']?.[d.key];
                            return (
                              <td key={d.key} className="border border-slate-300 p-2 text-center">
                                {status === 'completed' ? (
                                  <span className="font-bold text-emerald-700">✓</span>
                                ) : status === 'missed' ? (
                                  <span className="font-bold text-rose-600">✗</span>
                                ) : (
                                  <span className="text-slate-300">○</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="border border-slate-300 p-2 text-center font-bold">
                            {h.weeklyGoal}/7
                          </td>
                          <td className="border border-slate-300 p-2 text-center font-bold text-blue-800">
                            {rate}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Reflection Notes section */}
                <div className="grid grid-cols-2 gap-4 border border-slate-300 p-4 rounded-lg bg-slate-50/50">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">
                      Weekly Wins & Breakthroughs
                    </h4>
                    <div className="space-y-2">
                      <div className="border-b border-slate-200 h-6" />
                      <div className="border-b border-slate-200 h-6" />
                      <div className="border-b border-slate-200 h-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase mb-2">
                      Next Week Focus & Adjustments
                    </h4>
                    <div className="space-y-2">
                      <div className="border-b border-slate-200 h-6" />
                      <div className="border-b border-slate-200 h-6" />
                      <div className="border-b border-slate-200 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Layout 2: Annual 12-Month */}
            {printLayout === 'annual' && (
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                    12-Month Habit Master Planner
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">Year {profile.year}</span>
                </div>

                <table className="w-full border-collapse border border-slate-300 text-xs mb-6">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[9px] font-bold text-slate-700 uppercase">
                      <th className="border border-slate-300 p-1.5 text-left">HABIT</th>
                      {MONTH_NAMES.map((m) => (
                        <th key={m} className="border border-slate-300 p-1.5 text-center w-7">
                          {m}
                        </th>
                      ))}
                      <th className="border border-slate-300 p-1.5 text-center w-10">AVG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((h) => (
                      <tr key={h.id} className="border-b border-slate-200 text-[11px]">
                        <td className="border border-slate-300 p-1.5 font-bold">
                          {h.name}
                        </td>
                        {MONTH_NAMES.map((_, idx) => {
                          const monthKey = String(idx + 1).padStart(2, '0');
                          const val = h.monthlyLogs?.[monthKey] || 85;
                          return (
                            <td key={monthKey} className="border border-slate-300 p-1.5 text-center">
                              {val}%
                            </td>
                          );
                        })}
                        <td className="border border-slate-300 p-1.5 text-center font-bold text-blue-800">
                          90%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border border-slate-300 p-4 rounded-lg bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-900 uppercase mb-1">
                    Annual Identity Statement:
                  </h4>
                  <p className="text-xs text-slate-600 italic">
                    "{profile.vision}"
                  </p>
                </div>
              </div>
            )}

            {/* Layout 3: To-Do */}
            {printLayout === 'todo' && (
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                    Task Execution & Priority List
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">Date: ____________</span>
                </div>

                <table className="w-full border-collapse border border-slate-300 text-xs mb-6">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                      <th className="border border-slate-300 p-2 w-8 text-center">DONE</th>
                      <th className="border border-slate-300 p-2 text-left">TASK</th>
                      <th className="border border-slate-300 p-2 text-left w-24">CATEGORY</th>
                      <th className="border border-slate-300 p-2 text-center w-20">PRIORITY</th>
                      <th className="border border-slate-300 p-2 text-right w-24">DUE DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t.id} className="border-b border-slate-200">
                        <td className="border border-slate-300 p-2 text-center">
                          {t.done ? '☑' : '☐'}
                        </td>
                        <td className={`border border-slate-300 p-2 font-semibold ${t.done ? 'line-through text-slate-400' : ''}`}>
                          {t.task}
                        </td>
                        <td className="border border-slate-300 p-2 text-slate-600">
                          {t.category}
                        </td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-blue-800">
                          {t.priority}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-mono text-slate-500">
                          {t.dueDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-400">
              <span>HABIT FORGE © 2026 · BUILD BETTER. EVERY DAY.</span>
              <span>Premium Digital Planner Edition</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
