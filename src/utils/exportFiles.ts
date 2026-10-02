import * as XLSX from 'xlsx';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { Habit, TodoTask, PlannerProfile, DayKey } from '../types';
import { DAYS_OF_WEEK, MONTH_NAMES } from '../data/initialData';
import {
  getHabitWeeklyCompletedDays,
  calculateHabitWeeklyRate,
  calculateAnnualHabitRate,
  calculateTaskStats,
} from './calculations';

// ==========================================
// 1. EXCEL (.XLSX) EXPORT GENERATOR
// ==========================================

export function exportToExcel(
  habits: Habit[],
  tasks: TodoTask[],
  profile: PlannerProfile,
  weekId = '2026-W40'
) {
  const wb = XLSX.utils.book_new();

  // ----------------------------------------
  // Sheet 1: Weekly Habits Tracker
  // ----------------------------------------
  const weeklyData: (string | number)[][] = [
    ['HABIT FORGE - WEEKLY HABIT TRACKER'],
    ['TAGLINE: BUILD BETTER. EVERY DAY.'],
    [`User: ${profile.name}`, `Week: ${weekId}`, `Start Date: ${profile.startDate}`],
    [], // empty row
    [
      'Habit Name',
      'Category',
      'Frequency',
      'MON',
      'TUE',
      'WED',
      'THU',
      'FRI',
      'SAT',
      'SUN',
      'Done Days',
      'Goal (Days)',
      'Completion %',
      'Notes / Rule',
    ],
  ];

  habits.forEach((h) => {
    const logs = h.weeklyLogs[weekId] || ({} as Record<DayKey, string>);
    const mon = logs.mon === 'completed' ? '✓' : logs.mon === 'missed' ? '✗' : '-';
    const tue = logs.tue === 'completed' ? '✓' : logs.tue === 'missed' ? '✗' : '-';
    const wed = logs.wed === 'completed' ? '✓' : logs.wed === 'missed' ? '✗' : '-';
    const thu = logs.thu === 'completed' ? '✓' : logs.thu === 'missed' ? '✗' : '-';
    const fri = logs.fri === 'completed' ? '✓' : logs.fri === 'missed' ? '✗' : '-';
    const sat = logs.sat === 'completed' ? '✓' : logs.sat === 'missed' ? '✗' : '-';
    const sun = logs.sun === 'completed' ? '✓' : logs.sun === 'missed' ? '✗' : '-';
    const completed = getHabitWeeklyCompletedDays(h, weekId);
    const goal = h.weeklyGoal || 7;
    const rate = calculateHabitWeeklyRate(h, weekId);

    weeklyData.push([
      h.name,
      h.category,
      h.frequency,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
      completed,
      goal,
      `${rate}%`,
      h.notes || '',
    ]);
  });

  const wsWeekly = XLSX.utils.aoa_to_sheet(weeklyData);
  // Set nice column widths
  wsWeekly['!cols'] = [
    { wch: 24 }, // Habit Name
    { wch: 14 }, // Category
    { wch: 12 }, // Frequency
    { wch: 6 },  // Mon
    { wch: 6 },  // Tue
    { wch: 6 },  // Wed
    { wch: 6 },  // Thu
    { wch: 6 },  // Fri
    { wch: 6 },  // Sat
    { wch: 6 },  // Sun
    { wch: 11 }, // Done Days
    { wch: 12 }, // Goal
    { wch: 14 }, // Completion %
    { wch: 35 }, // Notes
  ];
  XLSX.utils.book_append_sheet(wb, wsWeekly, 'Weekly Habits');

  // ----------------------------------------
  // Sheet 2: 12-Month Habit Planner
  // ----------------------------------------
  const annualData: (string | number)[][] = [
    ['HABIT FORGE - 12-MONTH HABIT PLANNER'],
    [`User: ${profile.name}`, `Year: ${profile.year}`],
    [],
    [
      'Habit Name',
      'Category',
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
      'Annual Average %',
    ],
  ];

  habits.forEach((h) => {
    const row: (string | number)[] = [h.name, h.category];
    MONTH_NAMES.forEach((_, idx) => {
      const monthKey = String(idx + 1).padStart(2, '0');
      const val = h.monthlyLogs?.[monthKey] ?? 0;
      row.push(`${val}%`);
    });
    row.push(`${calculateAnnualHabitRate(h)}%`);
    annualData.push(row);
  });

  const wsAnnual = XLSX.utils.aoa_to_sheet(annualData);
  wsAnnual['!cols'] = [
    { wch: 24 },
    { wch: 14 },
    ...MONTH_NAMES.map(() => ({ wch: 7 })),
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, wsAnnual, '12-Month Planner');

  // ----------------------------------------
  // Sheet 3: To-Do List
  // ----------------------------------------
  const taskStats = calculateTaskStats(tasks);
  const todoData: (string | number)[][] = [
    ['HABIT FORGE - TASK & TO-DO EXECUTION QUEUE'],
    [`Total: ${taskStats.total}`, `Completed: ${taskStats.completed}`, `Remaining: ${taskStats.remaining}`, `Rate: ${taskStats.completionRate}%`],
    [],
    ['Done', 'Task Description', 'Category', 'Priority', 'Status', 'Due Date'],
  ];

  tasks.forEach((t) => {
    todoData.push([
      t.done ? 'YES (✓)' : 'NO (☐)',
      t.task,
      t.category,
      t.priority,
      t.status,
      t.dueDate,
    ]);
  });

  const wsTodo = XLSX.utils.aoa_to_sheet(todoData);
  wsTodo['!cols'] = [
    { wch: 12 },
    { wch: 36 },
    { wch: 15 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTodo, 'To-Do List');

  // ----------------------------------------
  // Sheet 4: Monthly Goals & Protocol Notes
  // ----------------------------------------
  const goalsData: (string | number)[][] = [
    ['HABIT FORGE - MONTHLY GOALS & NOTES'],
    [`User: ${profile.name}`, `Yearly Vision: ${profile.vision}`],
    [],
    ['Month', 'Goal 1', 'Goal 2', 'Goal 3'],
  ];

  MONTH_NAMES.forEach((m) => {
    const list = profile.monthlyGoals[m] || [];
    goalsData.push([m, list[0] || '', list[1] || '', list[2] || '']);
  });

  goalsData.push([]);
  goalsData.push(['Personal Rules & Notes:']);
  goalsData.push([profile.notes]);

  const wsGoals = XLSX.utils.aoa_to_sheet(goalsData);
  wsGoals['!cols'] = [
    { wch: 10 },
    { wch: 32 },
    { wch: 32 },
    { wch: 32 },
  ];
  XLSX.utils.book_append_sheet(wb, wsGoals, 'Goals & Protocol');

  // Generate and trigger download
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HabitForge_Planner_${profile.year || 2026}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================
// 2. WORD (.DOCX) EXPORT GENERATOR
// ==========================================

export async function exportToWord(
  habits: Habit[],
  tasks: TodoTask[],
  profile: PlannerProfile,
  weekId = '2026-W40'
) {
  // Weekly Habits Table Rows
  const weeklyHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ children: [new Paragraph({ text: 'Habit Name', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Cat.', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Mon', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Tue', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Wed', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Thu', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Fri', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Sat', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Sun', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Goal', style: 'TableHeading' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Rate', style: 'TableHeading' })] }),
    ],
  });

  const weeklyRows = habits.map((h) => {
    const logs = h.weeklyLogs[weekId] || ({} as Record<DayKey, string>);
    const statusSign = (status: string) => (status === 'completed' ? '✓' : status === 'missed' ? '✗' : '·');

    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: h.name })] }),
        new TableCell({ children: [new Paragraph({ text: h.category })] }),
        new TableCell({ children: [new Paragraph({ text: statusSign(logs.mon) })] }),
        new TableCell({ children: [new Paragraph({ text: statusSign(logs.tue) })] }),
        new TableCell({ children: [new Paragraph({ text: statusSign(logs.wed) })] }),
        new TableCell({ children: [new Paragraph({ text: statusSign(logs.thu) })] }),
        new TableCell({ children: [new Paragraph({ text: statusSign(logs.fri) })] }),
        new TableCell({ children: [new Paragraph({ text: statusSign(logs.sat) })] }),
        new TableCell({ children: [new Paragraph({ text: statusSign(logs.sun) })] }),
        new TableCell({ children: [new Paragraph({ text: `${h.weeklyGoal}/7` })] }),
        new TableCell({ children: [new Paragraph({ text: `${calculateHabitWeeklyRate(h, weekId)}%` })] }),
      ],
    });
  });

  const weeklyTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [weeklyHeaderRow, ...weeklyRows],
  });

  // To-Do Table
  const todoHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ children: [new Paragraph({ text: 'Status' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Task' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Category' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Priority' })] }),
      new TableCell({ children: [new Paragraph({ text: 'Due Date' })] }),
    ],
  });

  const todoRows = tasks.map((t) => {
    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: t.done ? '[x] Done' : '[ ] Pending' })] }),
        new TableCell({ children: [new Paragraph({ text: t.task })] }),
        new TableCell({ children: [new Paragraph({ text: t.category })] }),
        new TableCell({ children: [new Paragraph({ text: t.priority })] }),
        new TableCell({ children: [new Paragraph({ text: t.dueDate })] }),
      ],
    });
  });

  const todoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [todoHeaderRow, ...todoRows],
  });

  // 12-Month Table
  const annualHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ children: [new Paragraph({ text: 'Habit' })] }),
      ...MONTH_NAMES.map((m) => new TableCell({ children: [new Paragraph({ text: m })] })),
      new TableCell({ children: [new Paragraph({ text: 'Annual' })] }),
    ],
  });

  const annualRows = habits.map((h) => {
    return new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: h.name })] }),
        ...MONTH_NAMES.map((_, idx) => {
          const monthKey = String(idx + 1).padStart(2, '0');
          const val = h.monthlyLogs?.[monthKey] ?? 0;
          return new TableCell({ children: [new Paragraph({ text: `${val}%` })] });
        }),
        new TableCell({ children: [new Paragraph({ text: `${calculateAnnualHabitRate(h)}%` })] }),
      ],
    });
  });

  const annualTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [annualHeaderRow, ...annualRows],
  });

  // Document Assembly
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Brand Title
          new Paragraph({
            text: 'HABIT FORGE',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'BUILD BETTER. EVERY DAY.',
                bold: true,
                color: '1D4ED8', // Royal Blue
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Planner Owner: `, bold: true }),
              new TextRun({ text: `${profile.name}   |   ` }),
              new TextRun({ text: `Start Date: `, bold: true }),
              new TextRun({ text: `${profile.startDate}   |   ` }),
              new TextRun({ text: `Year: `, bold: true }),
              new TextRun({ text: `${profile.year || 2026}` }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Vision & Core Creed: ', bold: true, italics: true }),
              new TextRun({ text: `"${profile.vision}"`, italics: true }),
            ],
            spacing: { after: 400 },
          }),

          // Section 1: Weekly Habits
          new Paragraph({
            text: '1. WEEKLY HABITS TRACKER',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),
          new Paragraph({
            text: 'Stay consistent with weekly routines. Logged status (✓ = completed, ✗ = missed).',
            spacing: { after: 200 },
          }),
          weeklyTable,

          // Section 2: 12-Month Habit Planner
          new Paragraph({
            text: '2. 12-MONTH HABIT PLANNER',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 },
          }),
          new Paragraph({
            text: 'Annual continuity and month-by-month consistency progression.',
            spacing: { after: 200 },
          }),
          annualTable,

          // Section 3: To-Do Execution List
          new Paragraph({
            text: '3. TO-DO LIST & TASK MANAGEMENT',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 },
          }),
          new Paragraph({
            text: 'Stay organized and get things done.',
            spacing: { after: 200 },
          }),
          todoTable,

          // Section 4: Personal Notes & Protocol
          new Paragraph({
            text: '4. PLANNER NOTES & RULES',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 },
          }),
          new Paragraph({
            text: profile.notes || 'Never miss twice.',
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `HabitForge_Document_${profile.year || 2026}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
