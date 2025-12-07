'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PredictResponse } from '@shared/api';
import apiClient from '@/services/apiClient';
import { generateDummy24HourForecast } from '@/services/dummyData';
import { RefreshCw, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ForecastChart from '@/components/ForecastChart';

interface InteractiveForecastToolProps {
  siteId: number;
  onForecastGenerated: (data: PredictResponse | null) => void;
}

interface FormData {
  year: number;
  month: number;
  day: number;
  hour: number;
  O3_forecast: number;
  NO2_forecast: number;
  T_forecast: number;
  q_forecast: number;
  u_forecast: number;
  v_forecast: number;
  w_forecast: number;
}

const defaultFormData: FormData = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  hour: new Date().getHours(),
  O3_forecast: 50,
  NO2_forecast: 70,
  T_forecast: 25,
  q_forecast: 50,
  u_forecast: 1.5,
  v_forecast: -0.5,
  w_forecast: 0,
};

export default function InteractiveForecastTool({
  siteId,
  onForecastGenerated,
}: InteractiveForecastToolProps) {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastResult, setForecastResult] = useState<PredictResponse | null>(null);
  const [csvData, setCsvData] = useState<FormData[] | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const parseCSVData = (csvContent: string): FormData[] | null => {
    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV file must contain header and at least one data row');
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const requiredFields = ['year', 'month', 'day', 'hour', 'o3_forecast', 'no2_forecast', 't_forecast', 'q_forecast', 'u_forecast', 'v_forecast', 'w_forecast'];
      const missingFields = requiredFields.filter((field) => !headers.includes(field));

      if (missingFields.length > 0) {
        throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
      }

      const parsedData: FormData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        if (values.some((v) => v === '')) continue;

        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
          row[header] = isNaN(parseFloat(values[index])) ? values[index] : parseFloat(values[index]);
        });

        parsedData.push({
          year: row.year || defaultFormData.year,
          month: row.month || defaultFormData.month,
          day: row.day || defaultFormData.day,
          hour: row.hour || defaultFormData.hour,
          O3_forecast: row.o3_forecast || defaultFormData.O3_forecast,
          NO2_forecast: row.no2_forecast || defaultFormData.NO2_forecast,
          T_forecast: row.t_forecast || defaultFormData.T_forecast,
          q_forecast: row.q_forecast || defaultFormData.q_forecast,
          u_forecast: row.u_forecast || defaultFormData.u_forecast,
          v_forecast: row.v_forecast || defaultFormData.v_forecast,
          w_forecast: row.w_forecast || defaultFormData.w_forecast,
        });
      }

      if (parsedData.length === 0) {
        throw new Error('No valid data rows found in CSV');
      }

      return parsedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse CSV';
      setCsvError(errorMessage);
      return null;
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setCsvError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCSVData(content);
      if (parsed) {
        setCsvData(parsed);
        setCsvError(null);
        setFormData(parsed[0]);
      }
    };
    reader.onerror = () => {
      setCsvError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleLoadFromCSV = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use dummy data for now
      const result = generateDummy24HourForecast(siteId);
      setForecastResult(result);
      onForecastGenerated(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate forecast';
      setError(errorMessage);
      console.error('Error generating forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setError(null);
    setForecastResult(null);
    setCsvData(null);
    setCsvError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onForecastGenerated(null);
  };

  return (
    <div className="space-y-6">
      {/* CSV Upload Section */}
      <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Input Data</h3>
            <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {csvData && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  CSV loaded with {csvData.length} rows
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
            <Button
              type="button"
              onClick={handleLoadFromCSV}
              className={`gap-2 border-0 ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
            >
              <Upload className="w-4 h-4" />
              Load from CSV
            </Button>
            {csvData && (
              <Button
                type="button"
                onClick={() => {
                  setCsvData(null);
                  setFormData(defaultFormData);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                variant="outline"
                className={`${theme === 'dark' ? 'border-slate-600 text-slate-200 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
              >
                Clear CSV
              </Button>
            )}
          </div>

          {csvError && (
            <div className={`p-4 rounded-lg flex items-start gap-3 border ${theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-300'}`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
              <div className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>
                <p className="font-semibold">CSV Error</p>
                <p className="mt-1">{csvError}</p>
              </div>
            </div>
          )}

          {csvData && (
            <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                <span className="font-semibold">CSV Data Loaded:</span> {csvData.length} rows ready for processing
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Input Form */}
      <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Input Meteorological Data</h3>

        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-300'}`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
            <div className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>
              <p className="font-semibold">Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date/Time Section */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Date & Time</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                  min="2000"
                  max="2100"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Month</label>
                <input
                  type="number"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Day</label>
                <input
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                  min="1"
                  max="31"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Hour</label>
                <input
                  type="number"
                  name="hour"
                  value={formData.hour}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                  min="0"
                  max="23"
                />
              </div>
            </div>
          </div>

          {/* Pollutant Forecast Section */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Pollutant Forecast (µg/m³)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>O₃ Forecast</label>
                <input
                  type="number"
                  name="O3_forecast"
                  value={formData.O3_forecast}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>NO₂ Forecast</label>
                <input
                  type="number"
                  name="NO2_forecast"
                  value={formData.NO2_forecast}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                />
              </div>
            </div>
          </div>

          {/* Meteorological Data Section */}
          <div>
            <h4 className={`font-semibold mb-4 text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Meteorological Variables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="T_forecast"
                  value={formData.T_forecast}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Specific Humidity (g/kg)
                </label>
                <input
                  type="number"
                  name="q_forecast"
                  value={formData.q_forecast}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  U Wind (m/s)
                </label>
                <input
                  type="number"
                  name="u_forecast"
                  value={formData.u_forecast}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  V Wind (m/s)
                </label>
                <input
                  type="number"
                  name="v_forecast"
                  value={formData.v_forecast}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Vertical Velocity (m/s)
                </label>
                <input
                  type="number"
                  name="w_forecast"
                  value={formData.w_forecast}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-slate-50 text-slate-900'}`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Generate Forecast
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              disabled={loading}
              variant="outline"
              className={`${theme === 'dark' ? 'border-slate-600 text-slate-200 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>

      {/* Forecast Results */}
      {forecastResult && <ForecastChart data={forecastResult} siteId={siteId} />}
    </div>
  );
}
