import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

interface OverviewMetricsProps {
  o3: number;
  no2: number;
  hcho: number;
  co: number;
  pm25: number;
  pm10: number;
  hchoTrend: number;
  coTrend: number;
  pm25Trend: number;
  pm10Trend: number;
  o3Trend: number;
  no2Trend: number;
}

export default function OverviewMetrics({
  o3,
  no2,
  hcho,
  co,
  pm25,
  pm10,
  o3Trend,
  no2Trend,
  hchoTrend,
  coTrend,
  pm25Trend,
  pm10Trend,
}: OverviewMetricsProps) {
  const { theme } = useTheme();

  const getTrendColor = (trend: number) => {
    if (trend < 0) return 'text-green-400';
    if (trend > 0) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getTrendLabel = (trend: number) => {
    if (trend < 0) return '↓ Decreasing';
    if (trend > 0) return '↑ Increasing';
    return '→ Stable';
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className={`p-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Current O₃ (ppb)</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-blue-500">{Math.round(o3)}</span>
          <span className={`text-sm font-semibold mb-1 ${getTrendColor(o3Trend)}`}>
            {getTrendLabel(o3Trend)}
          </span>
        </div>
      </Card>

      <Card className={`p-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Current NO₂ (ppb)</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-blue-500">{Math.round(no2)}</span>
          <span className={`text-sm font-semibold mb-1 ${getTrendColor(no2Trend)}`}>
            {getTrendLabel(no2Trend)}
          </span>
        </div>
      </Card>
      <Card className={`p-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Current CO (ppb)</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-blue-500">{Math.round(co)}</span>
          <span className={`text-sm font-semibold mb-1 ${getTrendColor(coTrend)}`}>
            {getTrendLabel(no2Trend)}
          </span>
        </div>
      </Card>
      <Card className={`p-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Current HCHO (ppb)</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-blue-500">{Math.round(hcho)}</span>
          <span className={`text-sm font-semibold mb-1 ${getTrendColor(hchoTrend)}`}>
            {getTrendLabel(no2Trend)}
          </span>
        </div>
      </Card>
      <Card className={`p-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Current PM₂.₅ (ppb)</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-blue-500">{Math.round(pm25)}</span>
          <span className={`text-sm font-semibold mb-1 ${getTrendColor(pm25Trend)}`}>
            {getTrendLabel(no2Trend)}
          </span>
        </div>
      </Card>
       <Card className={`p-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Current PM₁₀ (ppb)</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-blue-500">{Math.round(pm10)}</span>
          <span className={`text-sm font-semibold mb-1 ${getTrendColor(pm10Trend)}`}>
            {getTrendLabel(no2Trend)}
          </span>
        </div>
      </Card>
    </div>
  );
}
