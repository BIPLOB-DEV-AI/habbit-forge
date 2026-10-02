import React, { useState } from 'react';
import { Printer, Plus, RotateCcw, Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'weekly' | 'annual' | 'todo' | 'stats' | 'preview';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddHabit: () => void;
  onOpenAddTask: () => void;
  onResetData: () => void;
  onPrint: () => void;
  onExportExcel: () => void;
  onExportWord: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddHabit,
  onOpenAddTask,
  onResetData,
  onPrint,
  onExportExcel,
  onExportWord,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; countBadge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'weekly', label: 'Weekly Habits' },
    { id: 'annual', label: 'Habit Planner' },
    { id: 'todo', label: 'To Do List' },
    { id: 'stats', label: 'Statistics' },
    { id: 'preview', label: 'Product Previews' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
      {/* Brand Sub-header Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-8 flex justify-between items-center tracking-wider uppercase font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span>System Active</span>
          <span className="text-slate-500 font-normal">|</span>
          <span className="text-slate-400">BUILD BETTER. EVERY DAY.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hidden sm:inline">2026 Master Planner</span>
          <button
            onClick={onResetData}
            title="Reset sample data to initial state"
            className="hover:text-white transition-colors flex items-center gap-1 normal-case font-normal text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main 3-Zone Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white font-extrabold text-sm shadow-sm ring-2 ring-blue-100">
              HF
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-none">
                HABIT FORGE
              </span>
              <span className="text-[10px] font-bold text-blue-700 tracking-widest uppercase block mt-0.5">
                BUILD BETTER. EVERY DAY.
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 relative">
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                title="Convert and download as Excel (.xlsx) or Word (.docx)"
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isExportMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsExportMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 text-xs animate-fadeIn">
                    <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Download File
                    </div>
                    <button
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        onExportExcel();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 text-slate-800 hover:text-blue-900 font-medium flex items-center gap-2.5 transition-colors"
                    >
                      <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold">Excel File (.xlsx)</div>
                        <div className="text-[10px] text-slate-500">Multi-sheet workbook</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        onExportWord();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 text-slate-800 hover:text-blue-900 font-medium flex items-center gap-2.5 transition-colors mt-0.5"
                    >
                      <div className="w-6 h-6 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold">Word File (.docx)</div>
                        <div className="text-[10px] text-slate-500">Formatted planner doc</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={onPrint}
              title="Print planner layout or save as PDF"
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={activeTab === 'todo' ? onOpenAddTask : onOpenAddHabit}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{activeTab === 'todo' ? 'New Task' : 'New Habit'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-700 text-white font-semibold'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
