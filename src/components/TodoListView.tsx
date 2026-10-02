import React, { useState } from 'react';
import { TodoTask, TaskPriority, TaskStatus, HabitCategory } from '../types';
import { calculateTaskStats } from '../utils/calculations';
import { CalloutBox } from './ui/CalloutBox';
import {
  Plus,
  CheckSquare,
  ListTodo,
  CheckCircle2,
  BarChart2,
  Trash2,
  Sparkles,
  Calendar,
  Tag,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

interface TodoListViewProps {
  tasks: TodoTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: TodoTask) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAddTask: () => void;
  onExportExcel?: () => void;
  onExportWord?: () => void;
}

export const TodoListView: React.FC<TodoListViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenAddTask,
  onExportExcel,
  onExportWord,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = calculateTaskStats(tasks);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesStatus =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Completed'
        ? t.done
        : !t.done;
    const matchesSearch = t.task.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

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
            <span className="text-xs text-slate-500 font-medium">Task Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            To Do List
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-blue-700 mt-1">
            STAY ORGANIZED AND GET THINGS DONE
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-end">
          {onExportExcel && (
            <button
              onClick={onExportExcel}
              className="px-2.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              title="Download to-do list as Excel file (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Excel</span>
            </button>
          )}

          {onExportWord && (
            <button
              onClick={onExportWord}
              className="px-2.5 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              title="Download to-do list as Word file (.docx)"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Word</span>
            </button>
          )}

          <button
            onClick={onOpenAddTask}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Summary Cards with Visual Progress Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL TASKS */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            TOTAL TASKS
          </span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums block mt-2">
            {stats.total}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Scheduled action items</span>
        </div>

        {/* COMPLETED */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            COMPLETED
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 tabular-nums block mt-2">
            {stats.completed}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Tasks accomplished</span>
        </div>

        {/* REMAINING */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            REMAINING
          </span>
          <span className="text-2xl font-extrabold text-amber-700 tabular-nums block mt-2">
            {stats.remaining}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Pending items to check</span>
        </div>

        {/* COMPLETION % */}
        <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              COMPLETION %
            </span>
            <span className="text-xs font-bold text-blue-700 tabular-nums">
              {stats.completionRate}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-700 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Automatic calculation
          </span>
        </div>
      </div>

      {/* Feature Callouts & The Large BONUS Badge */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CalloutBox
            title="ADD TASKS"
            description="Quickly add anything you need to do."
            icon={Plus}
          />
          <CalloutBox
            title="STAY ORGANIZED"
            description="Separate tasks into categories."
            icon={Tag}
          />
          <CalloutBox
            title="COMPLETE TASKS"
            description="Tick tasks when completed."
            icon={CheckCircle2}
          />
          <CalloutBox
            title="TRACK PROGRESS"
            description="Automatically calculate your progress."
            icon={BarChart2}
          />
        </div>

        {/* BONUS Badge as specified in prompt */}
        <div className="md:col-span-1">
          <CalloutBox
            title="Achieve More."
            description="Build habits.&#10;Complete more.&#10;Achieve more."
            variant="bonus"
            icon={Sparkles}
            className="h-full flex flex-col justify-center"
          />
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {(['All', 'Pending', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
          <span className="w-px h-4 bg-slate-200 mx-1" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Productivity">Productivity</option>
            <option value="Finance">Finance</option>
            <option value="Health">Health</option>
            <option value="Learning">Learning</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Personal">Personal</option>
            <option value="Mindset">Mindset</option>
          </select>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Clean Task Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">DONE</th>
                <th className="py-3.5 px-3 min-w-[240px]">TASK</th>
                <th className="py-3.5 px-3 min-w-[120px]">CATEGORY</th>
                <th className="py-3.5 px-3 min-w-[100px]">PRIORITY</th>
                <th className="py-3.5 px-3 min-w-[110px]">STATUS</th>
                <th className="py-3.5 px-3 min-w-[110px]">DUE DATE</th>
                <th className="py-3.5 px-4 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => {
                const priorityColor =
                  task.priority === 'High'
                    ? 'text-rose-700 font-bold'
                    : task.priority === 'Medium'
                    ? 'text-blue-700 font-semibold'
                    : 'text-slate-600 font-medium';

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-slate-50/70 transition-colors group ${
                      task.done ? 'bg-slate-50/40 text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {/* DONE Checkbox */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                          task.done
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                            : 'border-slate-300 bg-white hover:border-blue-600'
                        }`}
                        title={task.done ? 'Mark as incomplete' : 'Mark as done'}
                      >
                        {task.done && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </button>
                    </td>

                    {/* TASK Title */}
                    <td className="py-3 px-3 font-semibold">
                      <span
                        onClick={() => onToggleTask(task.id)}
                        className={`cursor-pointer hover:text-blue-700 transition-colors ${
                          task.done ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
                        }`}
                      >
                        {task.task}
                      </span>
                    </td>

                    {/* CATEGORY (Unboxed clean typography) */}
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {task.category}
                    </td>

                    {/* PRIORITY */}
                    <td className="py-3 px-3">
                      <span className={`text-xs ${priorityColor}`}>{task.priority}</span>
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs font-semibold ${
                          task.done
                            ? 'text-emerald-700'
                            : task.status === 'In Progress'
                            ? 'text-blue-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {task.done ? 'Completed' : task.status}
                      </span>
                    </td>

                    {/* DUE DATE */}
                    <td className="py-3 px-3 text-slate-600 tabular-nums font-medium">
                      {task.dueDate}
                    </td>

                    {/* DELETE */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 transition-opacity p-1"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state if filtered */}
        {filteredTasks.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No tasks match your current filter.
          </div>
        )}

        <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTasks.length} of {tasks.length} total tasks</span>
          <span className="text-blue-700 font-semibold">{stats.completed} Done ({stats.completionRate}%)</span>
        </div>
      </div>
    </div>
  );
};
