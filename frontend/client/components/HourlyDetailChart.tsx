import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface MinuteData {
  minute: number;
  time: string;
  O3: number;
  NO2: number;
  PM25: number;
  PM10: number;
}

interface HourlyDetailChartProps {
  hour: number;
  data: MinuteData[];
}

const generateMinuteData = (baseHour: number): MinuteData[] => {
  const data: MinuteData[] = [];
  const baseO3 = 35 + Math.sin((baseHour / 24 - 0.25) * Math.PI) * 45 + Math.random() * 15;
  const baseNO2 = 45 + Math.sin((baseHour / 24 - 0.2) * Math.PI * 2) * 35 + Math.random() * 12;
  const basePM25 = 35 + Math.cos((baseHour / 24) * Math.PI * 2) * 60 + Math.random() * 20;
  const basePM10 = 65 + Math.cos((baseHour / 24) * Math.PI * 2) * 90 + Math.random() * 30;

  for (let minute = 0; minute < 60; minute++) {
    // Smooth variations within the hour
    const minuteFraction = minute / 60;
    const trend = Math.sin(minuteFraction * Math.PI * 2) * 0.15;

    data.push({
      minute,
      time: `${String(baseHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      O3: Math.max(5, Math.round((baseO3 + trend * 8 + (Math.random() - 0.5) * 3) * 10) / 10),
      NO2: Math.max(10, Math.round((baseNO2 + trend * 6 + (Math.random() - 0.5) * 2) * 10) / 10),
      PM25: Math.max(5, Math.round((basePM25 + trend * 10 + (Math.random() - 0.5) * 4) * 10) / 10),
      PM10: Math.max(10, Math.round((basePM10 + trend * 15 + (Math.random() - 0.5) * 5) * 10) / 10),
    });
  }

  return data;
};

export default function HourlyDetailChart({ hour, data }: HourlyDetailChartProps) {
  const { theme } = useTheme();
  const chartData = data.length > 0 ? data : generateMinuteData(hour);

  return (
    <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-cyan-500" />
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Minute-Level Detail - Hour {String(hour).padStart(2, '0')}:00
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
          <XAxis
            dataKey="time"
            stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
            tick={{ fontSize: 10 }}
            interval={Math.floor(chartData.length / 12)} // Show ~12 labels
          />
          <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
              borderRadius: '8px',
            }}
            labelStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
            formatter={(value: number) => value.toFixed(1)}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line
            type="monotone"
            dataKey="O3"
            stroke="#06b6d4"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            name="O₃ (ppb)"
          />
          <Line
            type="monotone"
            dataKey="NO2"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            name="NO₂ (ppb)"
          />
          <Line
            type="monotone"
            dataKey="PM25"
            stroke="#f97316"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            strokeDasharray="5 5"
            name="PM2.5 (µg/m³)"
          />
          <Line
            type="monotone"
            dataKey="PM10"
            stroke="#ef4444"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            strokeDasharray="8 4"
            name="PM10 (µg/m³)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>O₃ Range</p>
          <p className="text-sm font-semibold text-cyan-600">
            {Math.round(Math.min(...chartData.map((d) => d.O3)))} - {Math.round(Math.max(...chartData.map((d) => d.O3)))} ppb
          </p>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>NO₂ Range</p>
          <p className="text-sm font-semibold text-blue-600">
            {Math.round(Math.min(...chartData.map((d) => d.NO2)))} - {Math.round(Math.max(...chartData.map((d) => d.NO2)))} ppb
          </p>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>PM2.5 Range</p>
          <p className="text-sm font-semibold text-orange-600">
            {Math.round(Math.min(...chartData.map((d) => d.PM25)))} - {Math.round(Math.max(...chartData.map((d) => d.PM25)))} µg/m³
          </p>
        </div>
        <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
          <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>PM10 Range</p>
          <p className="text-sm font-semibold text-red-600">
            {Math.round(Math.min(...chartData.map((d) => d.PM10)))} - {Math.round(Math.max(...chartData.map((d) => d.PM10)))} µg/m³
          </p>
        </div>
      </div>
    </Card>
  );
}
