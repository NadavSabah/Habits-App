/**
 * Statistics Chart Component
 *
 * Renders a line or bar chart from date/value data. Uses recharts.
 * Used for habit completion trends or other time-series stats.
 */

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { StatisticsChartProps } from '../../types';

export function StatisticsChart({ data, type = 'line' }: StatisticsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-card border border-gray-200 bg-gray-50 text-sm text-[var(--color-text)] opacity-80">
        No chart data
      </div>
    );
  }

  const chartContent =
    type === 'bar' ? (
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: 'var(--color-text)' }}
          stroke="var(--color-text)"
        />
        <YAxis
          tick={{ fontSize: 12, fill: 'var(--color-text)' }}
          stroke="var(--color-text)"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-bg, #fff)',
            border: '1px solid var(--color-border, #e5e7eb)',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'var(--color-text-heading)' }}
        />
        <Bar dataKey="value" fill="var(--color-primary, #6366f1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    ) : (
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: 'var(--color-text)' }}
          stroke="var(--color-text)"
        />
        <YAxis
          tick={{ fontSize: 12, fill: 'var(--color-text)' }}
          stroke="var(--color-text)"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-bg, #fff)',
            border: '1px solid var(--color-border, #e5e7eb)',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'var(--color-text-heading)' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-primary, #6366f1)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-primary)', r: 4 }}
        />
      </LineChart>
    );

  return (
    <div className="h-48 w-full rounded-card border border-gray-200 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        {chartContent}
      </ResponsiveContainer>
    </div>
  );
}
