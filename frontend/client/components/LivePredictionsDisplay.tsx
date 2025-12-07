import { LivePredictionResponse } from '@shared/api';
import { Card } from '@/components/ui/card';
import { TrendingUp, Clock, MapPin, AlertCircle } from 'lucide-react';

interface LivePredictionsDisplayProps {
  data: LivePredictionResponse;
}

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'text-green-600 bg-green-50';
  if (aqi <= 100) return 'text-yellow-600 bg-yellow-50';
  if (aqi <= 150) return 'text-orange-600 bg-orange-50';
  if (aqi <= 200) return 'text-red-600 bg-red-50';
  if (aqi <= 300) return 'text-red-700 bg-red-100';
  return 'text-purple-700 bg-purple-100';
};

const getAQILabel = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 150) return 'Moderately Polluted';
  if (aqi <= 200) return 'Poor';
  if (aqi <= 300) return 'Very Poor';
  return 'Severe';
};

const getPollutantLevel = (value: number, pollutant: 'O3' | 'NO2'): string => {
  if (pollutant === 'NO2') {
    if (value <= 40) return 'Good';
    if (value <= 80) return 'Moderate';
    if (value <= 180) return 'Poor';
    return 'Very Poor';
  } else if (pollutant === 'O3') {
    if (value <= 60) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 140) return 'Poor';
    return 'Very Poor';
  }
  return 'Unknown';
};

export default function LivePredictionsDisplay({
  data,
}: LivePredictionsDisplayProps) {
  const prediction = data.predictions[0];
  const source = data.live_source;

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* O3 Prediction */}
          <div className="bg-white rounded-lg p-4 border border-cyan-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">O₃ (Ozone)</h3>
            <div className="text-3xl font-bold text-cyan-600 mb-2">
              {prediction?.O3_target.toFixed(1)} µg/m³
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Status: <span className="font-semibold">{getPollutantLevel(prediction?.O3_target || 0, 'O3')}</span>
            </p>
            {source?.observed_o3 && (
              <div className="text-xs text-gray-500">
                Observed: {source.observed_o3} µg/m³
              </div>
            )}
          </div>

          {/* NO2 Prediction */}
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">NO₂ (Nitrogen Dioxide)</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {prediction?.NO2_target.toFixed(1)} µg/m³
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Status: <span className="font-semibold">{getPollutantLevel(prediction?.NO2_target || 0, 'NO2')}</span>
            </p>
            {source?.observed_no2 && (
              <div className="text-xs text-gray-500">
                Observed: {source.observed_no2} µg/m³
              </div>
            )}
          </div>

          {/* AQI Display */}
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Overall AQI</h3>
            <div className={`text-3xl font-bold mb-2 ${getAQIColor(source?.overall_aqi || 0).split(' ')[0]}`}>
              {source?.overall_aqi || 'N/A'}
            </div>
            <p className={`text-sm px-3 py-1 rounded-full inline-block ${getAQIColor(source?.overall_aqi || 0)}`}>
              {getAQILabel(source?.overall_aqi || 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* Source Information */}
      {source && (
        <Card className="border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                Station Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Station Name</p>
                  <p className="font-medium text-gray-900">{source.station_name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Station ID</p>
                  <p className="font-medium text-gray-900">#{source.station_id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">
                    {source.station_location[0].toFixed(4)}°N, {source.station_location[1].toFixed(4)}°E
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-600" />
                Measurement Time
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Timestamp</p>
                  <p className="font-medium text-gray-900">{source.measurement_time}</p>
                </div>
                <div>
                  <p className="text-gray-600">Timezone</p>
                  <p className="font-medium text-gray-900">{source.timezone}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Info Alert */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold">Live Prediction</p>
          <p className="mt-1">
            This prediction is generated using the latest observed data from the WAQI (World Air Quality Index) network and integrated with our forecasting model.
          </p>
        </div>
      </div>
    </div>
  );
}
