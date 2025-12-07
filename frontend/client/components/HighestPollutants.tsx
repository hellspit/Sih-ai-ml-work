import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';

interface PollutantEvent {
  name: string;
  location: string;
  value: string;
}

interface HighestPollutantsProps {
  o3Events: PollutantEvent[];
  no2Events: PollutantEvent[];
}

export default function HighestPollutants({
  o3Events,
  no2Events,
}: HighestPollutantsProps) {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Highest O3 */}
      <Card className={`p-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Highest O₃, Today</h3>
        </div>
        <div className="space-y-2">
          {o3Events.map((event, idx) => (
            <div key={idx} className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <p className="font-medium">{idx + 1}. {event.name} Region</p>
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{event.location}</p>
              <p className="text-amber-600 font-semibold">{event.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Highest NO2 */}
      <Card className={`p-4 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>Highest NO₂, Today</h3>
        </div>
        <div className="space-y-2">
          {no2Events.map((event, idx) => (
            <div key={idx} className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <p className="font-medium">{idx + 1}. {event.name} Region</p>
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{event.location}</p>
              <p className="text-red-600 font-semibold">{event.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
