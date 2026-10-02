import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CalloutBoxProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: 'blue' | 'light' | 'bonus';
  className?: string;
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({
  title,
  description,
  icon: Icon,
  variant = 'blue',
  className = '',
}) => {
  if (variant === 'bonus') {
    return (
      <div className={`p-5 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white shadow-sm border border-blue-700/50 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded text-blue-100">
            BONUS
          </span>
          {Icon && <Icon className="w-4 h-4 text-blue-200" />}
        </div>
        <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
        <p className="text-sm text-blue-100/90 mt-1 leading-relaxed whitespace-pre-line">{description}</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 transition-colors shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
            {title}
          </h5>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
