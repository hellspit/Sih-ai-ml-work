'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

interface PollutantEvalMetrics {
  pollutant: string;
  rmse: number;
  mae: number;
  r_mean: number;
  unit: string;
  color: string;
}

interface EvaluationDataPoint {
  time: string;
  predicted: number;
  actual: number;
}

interface RunningMeanDataPoint {
  date: string;
  rmse: number;
  mae: number;
  r2: number;
}

const ModelEvaluation = () => {
  const { theme } = useTheme();
  const [selectedPollutant, setSelectedPollutant] = useState<'NO2' | 'O3'>('O3');

  // Dummy metrics data for demonstration
  const metricsData: Record<string, PollutantEvalMetrics> = {
    O3: {
      pollutant: 'O₃',
      rmse: 2.0,
      mae: 10,
      r_mean: 0.92,
      unit: 'ppb',
      color: '#06b6d4',
    },
    NO2: {
      pollutant: 'NO₂',
      rmse: 3.5,
      mae: 15,
      r_mean: 0.88,
      unit: 'ppb',
      color: '#2563eb',
    },
  };

  // Generate realistic evaluation chart data
  const generateEvaluationData = (pollutant: 'NO2' | 'O3'): EvaluationDataPoint[] => {
    const baseValue = pollutant === 'O3' ? 50 : 70;
    const data: EvaluationDataPoint[] = [];

    for (let i = 0; i < 24; i++) {
      const variance = Math.sin(i / 24 * Math.PI * 2) * 15;
      const predicted = baseValue + variance + (Math.random() - 0.5) * 8;
      const actual = baseValue + variance + (Math.random() - 0.5) * 10;

      data.push({
        time: `${String(i).padStart(2, '0')}:00`,
        predicted: Math.max(0, Math.round(predicted * 10) / 10),
        actual: Math.max(0, Math.round(actual * 10) / 10),
      });
    }

    return data;
  };

  // Generate running mean data for RMSE, MAE, and R²
  const generateRunningMeanData = (pollutant: 'NO2' | 'O3'): RunningMeanDataPoint[] => {
    const startDate = new Date('2024-11-29');
    const data: RunningMeanDataPoint[] = [];

    for (let i = 0; i < 10; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      const dateStr = `${currentDate.toLocaleString('en-US', { month: 'short' })} ${currentDate.getDate()}`;

      // Create a smooth curve for running means
      const progress = i / 9;
      let rmseValue, maeValue, r2Value;

      if (pollutant === 'O3') {
        rmseValue = 5 + Math.sin(progress * Math.PI * 2) * 3 + progress * 2;
        maeValue = 12 + Math.sin(progress * Math.PI * 1.5) * 4 + progress * 3;
        r2Value = 0.75 + Math.sin(progress * Math.PI * 1.2) * 0.15 + progress * 0.1;
      } else {
        rmseValue = 6 + Math.sin(progress * Math.PI * 2) * 3.5 + progress * 2.5;
        maeValue = 14 + Math.sin(progress * Math.PI * 1.5) * 5 + progress * 3.5;
        r2Value = 0.72 + Math.sin(progress * Math.PI * 1.2) * 0.16 + progress * 0.12;
      }

      data.push({
        date: dateStr,
        rmse: Math.max(0, Math.round(rmseValue * 10) / 10),
        mae: Math.max(0, Math.round(maeValue * 10) / 10),
        r2: Math.max(0, Math.min(1, Math.round(r2Value * 100) / 100)),
      });
    }

    return data;
  };

  const evaluationData = generateEvaluationData(selectedPollutant);
  const runningMeanData = generateRunningMeanData(selectedPollutant);
  const metrics = metricsData[selectedPollutant];

  return (
    <div className="space-y-6">
      {/* Pollutant Selector */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Pollutant:</span>
          <div className="flex gap-2">
            {(['NO2', 'O3'] as const).map((pollutant) => (
              <button
                key={pollutant}
                onClick={() => setSelectedPollutant(pollutant)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedPollutant === pollutant
                    ? 'bg-cyan-600 text-white'
                    : theme === 'dark'
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {pollutant === 'NO2' ? 'NO₂' : 'O₃'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RMSE Card */}
        <Card className={`border p-6 rounded-xl ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                RMSE
              </h3>
              <Badge className="bg-cyan-600/20 text-cyan-400 border-0">
                {metrics.unit}
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{metrics.rmse}</span>
              <span className={`text-lg mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{metrics.unit}</span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Root Mean Square Error - measures prediction error magnitude
            </p>
          </div>
        </Card>

        {/* MAE Card */}
        <Card className={`border p-6 rounded-xl ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                MAE
              </h3>
              <Badge className="bg-blue-600/20 text-blue-400 border-0">
                {metrics.unit}
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{metrics.mae}</span>
              <span className={`text-lg mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{metrics.unit}</span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Mean Absolute Error - average absolute deviation
            </p>
          </div>
        </Card>

        {/* R² (R-mean) Card */}
        <Card className={`border p-6 rounded-xl ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                R²
              </h3>
              <Badge className="bg-emerald-600/20 text-emerald-400 border-0">
                Score
              </Badge>
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{metrics.r_mean}</span>
              <span className={`text-lg mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>out of 1.0</span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Coefficient of Determination - explained variance ratio
            </p>
          </div>
        </Card>
      </div>

      {/* Prediction vs Actual Chart */}
      <Card className={`border p-6 rounded-xl ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {metrics.pollutant} - Predicted vs Actual Values
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={evaluationData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === 'dark' ? '#334155' : '#e2e8f0'}
            />
            <XAxis dataKey="time" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
            <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke={metrics.color}
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              name={`Predicted ${metrics.pollutant}`}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              name={`Actual ${metrics.pollutant}`}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Running Mean - RMSE */}
      <Card className={`border p-6 rounded-xl ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Running Mean (RMSE) - {metrics.pollutant}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={runningMeanData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
            <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} label={{ value: `${metrics.unit}`, angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Line
              type="monotone"
              dataKey="rmse"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              name={`RMSE (${metrics.unit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Running Mean - MAE */}
      <Card className={`border p-6 rounded-xl ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Running Mean (MAE) - {metrics.pollutant}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={runningMeanData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
            <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} label={{ value: `${metrics.unit}`, angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Line
              type="monotone"
              dataKey="mae"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              name={`MAE (${metrics.unit})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Running Mean - R² */}
      <Card className={`border p-6 rounded-xl ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Running Mean (R²) - {metrics.pollutant}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={runningMeanData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
            <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} domain={[0, 1]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
              formatter={(value: number) => value.toFixed(3)}
            />
            <Line
              type="monotone"
              dataKey="r2"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              name="R² Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Model Performance Info */}
      <Card className={`border p-6 rounded-xl ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Model Performance Analysis</h3>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          <div className="space-y-3">
            <div>
              <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>RMSE (Root Mean Square Error)</p>
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                The RMSE of {metrics.rmse} {metrics.unit} indicates the average magnitude of prediction
                errors. Lower values indicate better model performance.
              </p>
            </div>
            <div>
              <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>MAE (Mean Absolute Error)</p>
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                The MAE of {metrics.mae} {metrics.unit} represents the average absolute difference
                between predicted and actual values.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>R² (Coefficient of Determination)</p>
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                An R² value of {metrics.r_mean} (on a scale of 0 to 1) indicates that the model
                explains {(metrics.r_mean * 100).toFixed(0)}% of the variance in the data.
              </p>
            </div>
            <div>
              <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Model Status</p>
              <p className="text-emerald-400">
                ✓ Model performance is excellent with high R² value and low error metrics
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ModelEvaluation;
