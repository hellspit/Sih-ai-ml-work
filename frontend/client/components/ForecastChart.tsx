import { useState } from 'react';
import { PredictResponse } from '@shared/api';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import HourlyDetailChart from '@/components/HourlyDetailChart';

interface ForecastChartProps {
  data: PredictResponse;
  siteId: number;
  timeRange?: 24 | 48;
}

export default function ForecastChart({ data, siteId, timeRange = 24 }: ForecastChartProps) {
  const { theme } = useTheme();
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const chartData = data.predictions.map((pred) => ({
    hour: `${String(pred.hour).padStart(2, '0')}:00`,
    fullHour: pred.hour,
    O3: parseFloat(pred.O3_target.toFixed(1)),
    NO2: parseFloat(pred.NO2_target.toFixed(1)),
  }));

  const maxO3 = Math.max(...data.predictions.map((p) => p.O3_target));
  const minO3 = Math.min(...data.predictions.map((p) => p.O3_target));
  const avgO3 = (data.predictions.reduce((sum, p) => sum + p.O3_target, 0) / data.predictions.length).toFixed(1);

  const maxNO2 = Math.max(...data.predictions.map((p) => p.NO2_target));
  const minNO2 = Math.min(...data.predictions.map((p) => p.NO2_target));
  const avgNO2 = (data.predictions.reduce((sum, p) => sum + p.NO2_target, 0) / data.predictions.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* O3 Stats */}
        <Card className={`border p-6 ${theme === 'dark' ? 'border-cyan-700 bg-gradient-to-br from-cyan-900/30 to-cyan-900/20' : 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100'}`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>O₃ (Ozone) - {timeRange} Hour Forecast</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Max</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{maxO3.toFixed(1)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>µg/m³</p>
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Average</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{avgO3}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>µg/m³</p>
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Min</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{minO3.toFixed(1)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>µg/m³</p>
            </div>
          </div>
        </Card>

        {/* NO2 Stats */}
        <Card className={`border p-6 ${theme === 'dark' ? 'border-blue-700 bg-gradient-to-br from-blue-900/30 to-blue-900/20' : 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100'}`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>NO₂ (Nitrogen Dioxide) - {timeRange} Hour Forecast</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Max</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{maxNO2.toFixed(1)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>µg/m³</p>
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Average</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{avgNO2}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>µg/m³</p>
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Min</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{minNO2.toFixed(1)}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>µg/m³</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
        <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{timeRange}-Hour Pollution Level Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
            <XAxis
              dataKey="hour"
              stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
              style={{ fontSize: '12px' }}
              label={{ value: 'Concentration (µg/m³)', angle: -90, position: 'insideLeft', fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
                padding: '8px',
              }}
              labelStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
              formatter={(value: number) => value.toFixed(1)}
              labelFormatter={(label) => `Hour: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="O3"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 4 }}
              activeDot={{ r: 6 }}
              name="O₃ (µg/m³)"
            />
            <Line
              type="monotone"
              dataKey="NO2"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
              name="NO₂ (µg/m³)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Hourly Detail Chart */}
      {selectedHour !== null && (
        <HourlyDetailChart hour={selectedHour} data={[]} />
      )}

      {/* Hour Selector Section */}
      <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
        <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Select Hour for Detailed Report</h3>
        <div className="mb-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Choose an hour to generate a detailed forecast report
          </p>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
          {data.predictions.map((pred) => {
            const hourLabel = timeRange === 48 && pred.hour >= 24 
              ? `Day 2 ${String(pred.hour % 24).padStart(2, '0')}:00`
              : `${String(pred.hour).padStart(2, '0')}:00`;
            const isSelected = selectedHour === pred.hour;
            
            return (
              <button
                key={pred.hour}
                onClick={() => setSelectedHour(pred.hour)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md'
                    : theme === 'dark'
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {hourLabel}
              </button>
            );
          })}
        </div>
        {selectedHour !== null && (
          <div className="mt-4 p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center justify-between mb-2">
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Selected Hour: {timeRange === 48 && selectedHour >= 24 
                  ? `Day 2 ${String(selectedHour % 24).padStart(2, '0')}:00`
                  : `${String(selectedHour).padStart(2, '0')}:00`}
              </span>
              <button
                onClick={() => setSelectedHour(null)}
                className={`text-sm px-2 py-1 rounded ${theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
              >
                Clear Selection
              </button>
            </div>
            {(() => {
              const selectedPred = data.predictions.find(p => p.hour === selectedHour);
              if (!selectedPred) return null;
              return (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>O₃ (µg/m³)</p>
                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      {selectedPred.O3_target.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>NO₂ (µg/m³)</p>
                    <p className={`text-lg font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {selectedPred.NO2_target.toFixed(1)}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Card>
    </div>
  );
}
