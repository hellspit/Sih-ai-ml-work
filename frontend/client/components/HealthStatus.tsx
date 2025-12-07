import { ModelHealthResponse, ModelDetailResponse } from '@shared/api';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface HealthStatusProps {
  healthStatus: ModelHealthResponse;
  modelDetail: ModelDetailResponse;
}

export default function HealthStatus({
  healthStatus,
  modelDetail,
}: HealthStatusProps) {
  const { theme } = useTheme();

  const getStatusIcon = (available: boolean) => {
    return available ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-500" />
    );
  };

  const modelEntries = Object.entries(healthStatus.models);

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <Card className={`border-2 p-6 ${theme === 'dark' ? 'border-green-700 bg-gradient-to-br from-green-900/30 to-emerald-900/30' : 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-green-500" />
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>System Health</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>API Status</p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-semibold text-green-600">Operational</p>
            </div>
          </div>
          <div>
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Models Available</p>
            <p className={`text-2xl font-bold text-green-600`}>
              {modelEntries.filter(([_, model]) => model.available).length} / {modelEntries.length}
            </p>
          </div>
          <div>
            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>System Message</p>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{healthStatus.message}</p>
          </div>
        </div>
      </Card>

      {/* Model Status Grid */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Model Status by Site</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelEntries.map(([siteKey, model]) => (
            <Card key={siteKey} className={`p-4 hover:shadow-lg transition-shadow border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
              <div className="flex items-start justify-between mb-3">
                <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {siteKey.replace('site_', 'Site ')}
                </h4>
                {getStatusIcon(model.available)}
              </div>
              <div className="space-y-2">
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Status</p>
                  <p className={`text-sm font-medium ${
                    model.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {model.available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
                {model.last_updated && (
                  <div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Last Updated</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{model.last_updated}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Model Details */}
      <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Selected Model Details</h3>
        <div className="space-y-6">
          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Model Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Site ID</p>
                <p className="text-lg font-bold text-cyan-600">{modelDetail.site_id}</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Model Name</p>
                <p className="text-lg font-bold text-blue-600">{modelDetail.model_name}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Model Features</h4>
            <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-slate-700/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {modelDetail.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className={`text-xs mt-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Total Features: <span className="font-semibold">{modelDetail.features.length}</span>
            </p>
          </div>

          <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
              <span className="font-semibold">Message: </span>
              {modelDetail.message}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
