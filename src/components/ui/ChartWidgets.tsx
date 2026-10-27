'use client';

import React, { useState } from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  barColor?: string;
}

export function SimpleBarChart({ data, height = 200, barColor = '#059669' }: BarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full flex flex-col justify-end" style={{ height }}>
      <div className="flex-1 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800">
        {data.map((d, idx) => {
          const heightPercent = Math.round((d.value / maxValue) * 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={d.label}
              className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-8 px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold z-20 whitespace-nowrap shadow-md pointer-events-none">
                  {d.value} Pengumpulan
                </div>
              )}

              {/* Bar */}
              <div
                className="w-full rounded-t-xl transition-all duration-300 group-hover:brightness-110"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                  minHeight: '8px',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between gap-3 sm:gap-6 px-2 pt-2 text-[11px] font-semibold text-slate-400">
        {data.map((d) => (
          <div key={d.label} className="flex-1 text-center truncate">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface StackedProgressProps {
  data: { label: string; passed: number; remidi: number }[];
}

export function SimpleStackedChart({ data }: StackedProgressProps) {
  return (
    <div className="space-y-4">
      {data.map((item) => {
        const total = item.passed + item.remidi;
        const passPercent = total > 0 ? Math.round((item.passed / total) * 100) : 0;
        const remidiPercent = 100 - passPercent;

        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
              <span className="text-[11px] text-slate-500 font-semibold">
                {item.passed} Tuntas • {item.remidi} Remidi ({passPercent}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${passPercent}%` }}
                title={`${item.passed} Tuntas`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${remidiPercent}%` }}
                title={`${item.remidi} Remidi`}
              />
            </div>
          </div>
        );
      })}

      <div className="pt-2 flex items-center justify-end gap-4 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Tuntas KKM</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Perlu Remidi</span>
        </span>
      </div>
    </div>
  );
}
