import React from 'react';

interface WeeklyBarChartProps {
  data: { day: string; short: string; completed: number; total: number; rate: number }[];
  targetRate?: number;
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
  data,
  targetRate = 85,
}) => {
  const maxHeight = 120;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
        <span>Daily Consistency (%)</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-700 inline-block" />
            <span>Actual</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-blue-300 inline-block border-t border-dashed border-blue-400" />
            <span>Target ({targetRate}%)</span>
          </span>
        </div>
      </div>

      <div className="relative pt-4 pb-2 border-b border-slate-200">
        {/* Target line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-blue-300 z-10 pointer-events-none"
          style={{ bottom: `${(targetRate / 100) * maxHeight + 28}px` }}
        />

        <div className="grid grid-cols-7 gap-2 items-end h-[140px]">
          {data.map((item, idx) => {
            const barHeight = Math.max(8, (item.rate / 100) * maxHeight);
            const isHighest = item.rate >= 90;
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 group">
                <span className="text-[11px] font-semibold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {item.rate}%
                </span>
                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-md relative flex items-end h-[120px] overflow-hidden">
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isHighest
                        ? 'bg-gradient-to-t from-blue-700 to-blue-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    style={{ height: `${barHeight}px` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-600 mt-1 uppercase tracking-wider">
                  {item.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
        <span>Mon - Start strong</span>
        <span>Sun - Weekly reset</span>
      </div>
    </div>
  );
};

interface MonthlyTrendChartProps {
  data: { month: string; average: number }[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const width = 600;
  const height = 140;
  const paddingX = 30;
  const paddingY = 20;

  const points = data.map((item, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (item.average / 100) * (height - paddingY * 2);
    return { x, y, value: item.average, month: item.month };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <span>12-Month Average Completion</span>
        <span className="text-blue-700 font-semibold tabular-nums">Annual Progress</span>
      </div>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1={paddingX} y1={(height - paddingY * 2) / 2 + paddingY} x2={width - paddingX} y2={(height - paddingY * 2) / 2 + paddingY} stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" />

          {/* Area fill */}
          <path d={areaD} fill="url(#blueGradient)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {points.map((p, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                className="fill-white stroke-blue-700 stroke-[2.5px] hover:r-6 transition-all"
              />
              <text
                x={p.x}
                y={height - 5}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="#64748b"
              >
                {p.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
