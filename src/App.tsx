/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Habit, TodoTask, PlannerProfile, DayKey, DayStatus } from './types';
import {
  loadHabits,
  saveHabits,
  loadTasks,
  saveTasks,
  loadProfile,
  saveProfile,
  resetAllToDefaults,
} from './utils/storage';
import { CURRENT_WEEK_ID } from './data/initialData';
import { Header, ActiveTab } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { WeeklyHabitsView } from './components/WeeklyHabitsView';
import { AnnualPlannerView } from './components/AnnualPlannerView';
import { TodoListView } from './components/TodoListView';
import { StatisticsView } from './components/StatisticsView';
import { PromotionalShowcaseView } from './components/PromotionalShowcaseView';
import { AddHabitModal } from './components/AddHabitModal';
import { AddTaskModal } from './components/AddTaskModal';
import { PrintModal } from './components/PrintModal';
import { exportToExcel, exportToWord } from './utils/exportFiles';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [tasks, setTasks] = useState<TodoTask[]>(() => loadTasks());
  const [profile, setProfile] = useState<PlannerProfile>(() => loadProfile());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle habit day status
  const handleUpdateHabitDay = (habitId: string, day: DayKey, status: DayStatus) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const currentLogs = h.weeklyLogs[CURRENT_WEEK_ID] || {
          mon: 'empty',
          tue: 'empty',
          wed: 'empty',
          thu: 'empty',
          fri: 'empty',
          sat: 'empty',
          sun: 'empty',
        };
        return {
          ...h,
          weeklyLogs: {
            ...h.weeklyLogs,
            [CURRENT_WEEK_ID]: {
              ...currentLogs,
              [day]: status,
            },
          },
        };
      })
    );
  };

  // Quick toggle today (Friday in sample cycle)
  const handleToggleHabitToday = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    const current = habit.weeklyLogs[CURRENT_WEEK_ID]?.fri || 'empty';
    const next: DayStatus = current === 'completed' ? 'empty' : 'completed';
    handleUpdateHabitDay(habitId, 'fri', next);
  };

  const handleUpdateHabitGoal = (habitId: string, newGoal: number) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, weeklyGoal: newGoal } : h))
    );
  };

  const handleUpdateMonthlyValue = (habitId: string, monthKey: string, value: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        return {
          ...h,
          monthlyLogs: {
            ...h.monthlyLogs,
            [monthKey]: value,
          },
        };
      })
    );
  };

  const handleAddHabit = (newHabit: Habit) => {
    setHabits((prev) => [newHabit, ...prev]);
    showToast(`Added habit: "${newHabit.name}"`);
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    if (habit) {
      showToast(`Removed habit: "${habit.name}"`);
    }
  };

  // Task actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done, status: !t.done ? 'Completed' : 'Pending' } : t))
    );
  };

  const handleAddTask = (newTask: TodoTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task created: "${newTask.task}"`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task deleted');
  };

  const handleExportExcel = () => {
    try {
      exportToExcel(habits, tasks, profile, CURRENT_WEEK_ID);
      showToast('Excel workbook (.xlsx) downloaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to export Excel file.');
    }
  };

  const handleExportWord = async () => {
    try {
      await exportToWord(habits, tasks, profile, CURRENT_WEEK_ID);
      showToast('Word document (.docx) downloaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to export Word document.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all sample data to default template state?')) {
      const defaults = resetAllToDefaults();
      setHabits(defaults.habits);
      setTasks(defaults.tasks);
      setProfile(defaults.profile);
      showToast('All planner data reset to default demo values.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 3-Zone Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddHabit={() => setIsAddHabitOpen(true)}
        onOpenAddTask={() => setIsAddTaskOpen(true)}
        onResetData={handleResetData}
        onPrint={() => setIsPrintModalOpen(true)}
        onExportExcel={handleExportExcel}
        onExportWord={handleExportWord}
      />

      {/* Main Viewport Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            habits={habits}
            tasks={tasks}
            onToggleHabitToday={handleToggleHabitToday}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddHabit={() => setIsAddHabitOpen(true)}
            onExportExcel={handleExportExcel}
            onExportWord={handleExportWord}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyHabitsView
            habits={habits}
            onUpdateHabitDay={handleUpdateHabitDay}
            onUpdateHabitGoal={handleUpdateHabitGoal}
            onDeleteHabit={handleDeleteHabit}
            onOpenAddHabit={() => setIsAddHabitOpen(true)}
            onExportExcel={handleExportExcel}
            onExportWord={handleExportWord}
          />
        )}

        {activeTab === 'annual' && (
          <AnnualPlannerView
            habits={habits}
            profile={profile}
            onUpdateProfile={setProfile}
            onUpdateMonthlyValue={handleUpdateMonthlyValue}
            onOpenAddHabit={() => setIsAddHabitOpen(true)}
            onExportExcel={handleExportExcel}
            onExportWord={handleExportWord}
          />
        )}

        {activeTab === 'todo' && (
          <TodoListView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
            onExportExcel={handleExportExcel}
            onExportWord={handleExportWord}
          />
        )}

        {activeTab === 'stats' && <StatisticsView habits={habits} />}

        {activeTab === 'preview' && (
          <PromotionalShowcaseView
            habits={habits}
            tasks={tasks}
            profile={profile}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-[10px]">
              HF
            </div>
            <span className="font-bold text-slate-800">HABIT FORGE</span>
            <span className="text-slate-300">·</span>
            <span>BUILD BETTER. EVERY DAY.</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <span>Automated Formula Calculations</span>
            <span>Print & PDF Ready</span>
            <span>Local Offline Persistence</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddHabitOpen}
        onClose={() => setIsAddHabitOpen(false)}
        onAddHabit={handleAddHabit}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        habits={habits}
        tasks={tasks}
        profile={profile}
        onExportExcel={handleExportExcel}
        onExportWord={handleExportWord}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-fadeIn flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
