import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Habit, HabitCategory, HabitFrequency } from '../types';
import { CATEGORIES, CURRENT_WEEK_ID } from '../data/initialData';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Habit) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Fitness');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [weeklyGoal, setWeeklyGoal] = useState<number>(7);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name: name.trim(),
      category,
      frequency,
      weeklyGoal: Number(weeklyGoal) || 7,
      weeklyLogs: {
        [CURRENT_WEEK_ID]: {
          mon: 'empty',
          tue: 'empty',
          wed: 'empty',
          thu: 'empty',
          fri: 'empty',
          sat: 'empty',
          sun: 'empty',
        },
      },
      monthlyLogs: {
        '01': 80, '02': 85, '03': 80, '04': 85, '05': 90, '06': 85,
        '07': 90, '08': 85, '09': 90, '10': 85, '11': 80, '12': 85,
      },
      createdDate: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
    };

    onAddHabit(newHabit);
    setName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Add New Habit</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Establish a routine and specify your weekly target cadence.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Habit Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Morning Cold Plunge, Read 30 Mins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
              >
                <option value="daily">Daily Habit</option>
                <option value="weekly">Weekly Routine</option>
                <option value="monthly">Monthly Milestone</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Weekly Target Days ({weeklyGoal} / 7)
              </label>
              <span className="text-xs text-blue-700 font-medium">
                {weeklyGoal === 7 ? 'Every single day' : `${weeklyGoal} days per week`}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="7"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(Number(e.target.value))}
              className="w-full accent-blue-700 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Routine Notes / Rule
            </label>
            <input
              type="text"
              placeholder="e.g., Immediately after waking up, 3 reps minimum"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Save Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
