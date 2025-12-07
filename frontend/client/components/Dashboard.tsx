// 'use client';

// import React, { useState, useEffect } from 'react';
// import { RefreshCw, AlertCircle, Clock, MapPin, Moon, Sun } from 'lucide-react';
// import { useTheme } from '@/contexts/ThemeContext';
// import { 
//   LivePredictionResponse, 
//   ModelHealthResponse, 
//   PredictResponse,
//   ModelDetailResponse 
// } from '@shared/api';
// import { 
//   generateDummyLivePrediction,
//   generateDummy24HourForecast,
//   generateDummyHealthStatus,
//   generateDummyModelDetail,
//   generateDummyPollutantMetrics,
//   PollutantMetrics,
// } from '@/services/dummyData';
// import { Button } from '@/components/ui/button';
// import Sidebar from '@/components/Sidebar';
// import OverviewMetrics from '@/components/OverviewMetrics';
// import PollutantGauge from '@/components/PollutantGauge';
// import HighestPollutants from '@/components/HighestPollutants';
// import SiteSelector from '@/components/SiteSelector';
// import ForecastChart from '@/components/ForecastChart';
// import InteractiveForecastTool from '@/components/InteractiveForecastTool';
// import HealthStatus from '@/components/HealthStatus';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import ModelEvaluation from '@/components/ModelEvaluation';

// type TabType = 'overview' | 'forecast' | 'tool' | 'health' | 'evaluation';
// type TimeRange = 1 | 24 | 48;

// export default function Dashboard() {
//   const { theme, toggleTheme } = useTheme();
//   const [selectedSite, setSelectedSite] = useState(1);
//   const [activeTab, setActiveTab] = useState<TabType>('overview');
//   const [timeRange, setTimeRange] = useState<TimeRange>(24);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [activeNav, setActiveNav] = useState('dashboard');
  
//   // Data states
//   const [liveData, setLiveData] = useState<LivePredictionResponse | null>(null);
//   const [forecastData, setForecastData] = useState<PredictResponse | null>(null);
//   const [healthStatus, setHealthStatus] = useState<ModelHealthResponse | null>(null);
//   const [modelDetail, setModelDetail] = useState<ModelDetailResponse | null>(null);
//   const [pollutantMetrics, setPollutantMetrics] = useState<PollutantMetrics | null>(null);

//   // Fetch all data
//   const fetchAllData = async (siteId: number, hours: TimeRange = 24) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [live, forecast, health, detail, metrics] = await Promise.all([
//         Promise.resolve(generateDummyLivePrediction(siteId)),
//         Promise.resolve(generateDummy24HourForecast(siteId, hours)),
//         Promise.resolve(generateDummyHealthStatus()),
//         Promise.resolve(generateDummyModelDetail(siteId)),
//         Promise.resolve(generateDummyPollutantMetrics()),
//       ]);

//       setLiveData(live);
//       setForecastData(forecast);
//       setHealthStatus(health);
//       setModelDetail(detail);
//       setPollutantMetrics(metrics);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
//       setError(errorMessage);
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSiteChange = (siteId: number) => {
//     setSelectedSite(siteId);
//   };

//   const handleRefresh = () => {
//     fetchAllData(selectedSite);
//   };

//   // Update activeTab based on activeNav
//   useEffect(() => {
//     if (activeNav === 'evaluation') {
//       setActiveTab('evaluation');
//     } else if (activeNav === 'forecast') {
//       setActiveTab('forecast');
//     } else if (activeNav === 'dashboard') {
//       setActiveTab('overview');
//     }
//   }, [activeNav]);

//   // Initial fetch
//   useEffect(() => {
//     fetchAllData(selectedSite, timeRange);
//   }, [selectedSite, timeRange]);

//   // Generate trend chart data with realistic patterns
//   const generateTrendData = () => {
//     const hours = timeRange;
//     const now = new Date();
//     const data = [];

//     for (let i = 0; i < hours; i++) {
//       const hour = (now.getHours() + i) % 24;
//       const timeOfDay = hour / 24;

//       // Realistic O3: peaks in afternoon
//       const o3Base = Math.sin((timeOfDay - 0.25) * Math.PI);
//       const o3Value = 35 + (o3Base * 40 + 20) + (Math.random() - 0.5) * 10;

//       // Realistic NO2: peaks in morning/evening (traffic hours)
//       const no2Morning = Math.sin((timeOfDay - 0.2) * Math.PI * 2) * 30;
//       const no2Evening = Math.sin((timeOfDay - 0.8) * Math.PI * 2) * 35;
//       const no2Value = 50 + (no2Morning + no2Evening) / 2 + (Math.random() - 0.5) * 8;

//       // Realistic PM2.5: similar to NO2 but smoother
//       const pm25Base = Math.cos(timeOfDay * Math.PI * 2) * 0.5 + 0.5;
//       const pm25Value = 35 + pm25Base * 60 + (Math.random() - 0.5) * 12;

//       // Realistic PM10: similar pattern to PM2.5 but with higher amplitude
//       const pm10Value = 65 + pm25Base * 90 + (Math.random() - 0.5) * 15;

//       data.push({
//         time: `${String(hour).padStart(2, '0')}:00`,
//         O3: Math.max(5, Math.round(o3Value * 10) / 10),
//         NO2: Math.max(10, Math.round(no2Value * 10) / 10),
//         PM25: Math.max(5, Math.round(pm25Value * 10) / 10),
//         PM10: Math.max(10, Math.round(pm10Value * 10) / 10),
//       });
//     }

//     return data;
//   };

//   const trendData = generateTrendData();

//   return (
//     <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
//       {/* Sidebar */}
//       <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

//       {/* Main Content */}
//       <main className="flex-1 overflow-auto">
//         {/* Header */}
//         <div className={`sticky top-0 z-40 ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} border-b`}>
//           <div className="px-8 py-6 flex items-center justify-between">
//             <div>
//               <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Air Quality Overview</h1>
//               <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Site Tracking Dashboard</p>
//             </div>
//             <div className="flex gap-3">
//               <Button
//                 onClick={toggleTheme}
//                 disabled={loading}
//                 className={`gap-2 border-0 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
//               >
//                 {theme === 'dark' ? (
//                   <Sun className="w-4 h-4" />
//                 ) : (
//                   <Moon className="w-4 h-4" />
//                 )}
//               </Button>
//               <Button
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white border-0"
//               >
//                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                 Refresh
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className={`p-8 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
//           {error && (
//             <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 ${theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-300'}`}>
//               <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
//               <div className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>
//                 <p className="font-semibold">Error</p>
//                 <p className="mt-1">{error}</p>
//               </div>
//             </div>
//           )}

//           {/* Site Selector */}
//           <div className="mb-8">
//             <SiteSelector 
//               selectedSite={selectedSite} 
//               onSiteChange={handleSiteChange}
//               disabled={loading}
//             />
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center py-12">
//               <div className="text-center">
//                 <RefreshCw className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
//                 <p className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Loading data...</p>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Tab Navigation */}
//               <div className={`mb-6 flex gap-2 rounded-lg p-1 border w-fit ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
//                 {[
//                   { id: 'overview', label: 'Overview' },
//                   { id: 'forecast', label: '24-Hour Forecast' },
//                   { id: 'tool', label: 'Forecast Tool' },
//                   { id: 'evaluation', label: 'Model Evaluation' },
//                   { id: 'health', label: 'Health Status' },
//                 ].map(({ id, label }) => (
//                   <button
//                     key={id}
//                     onClick={() => setActiveTab(id as TabType)}
//                     className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                       activeTab === id
//                         ? 'bg-cyan-600 text-white'
//                         : theme === 'dark'
//                         ? 'text-slate-300 hover:text-white'
//                         : 'text-slate-600 hover:text-slate-900'
//                     }`}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>

//               {/* Tab Content */}
//               {activeTab === 'overview' && (
//                 <div className="space-y-6">
//                   {/* Overview Metrics */}
//                   {liveData && pollutantMetrics && (
//                     <OverviewMetrics
//                       o3={liveData.predictions[0].O3_target}
//                       no2={liveData.predictions[0].NO2_target}
//                       hcho={liveData.predictions[0].HCHO_target}
//                       co = {liveData.predictions[0].CO_target}
//                       pm25={liveData.predictions[0].PM25_target}
//                       pm10={liveData.predictions[0].PM10_target}
//                       o3Trend={-5}
//                       no2Trend={3}
//                       hchoTrend={-2}
//                       coTrend={1}
//                       pm25Trend={4}
//                       pm10Trend={-3}
//                     />
//                   )}

//                   {/* Time Range Selector & Trend Chart */}
//                   <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
//                     <div className="flex items-center justify-between mb-6">
//                       <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Pollution Trends</h2>
//                       <div className={`flex gap-2 rounded-lg p-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
//                         {[1, 24, 48].map((hours) => (
//                           <button
//                             key={hours}
//                             onClick={() => setTimeRange(hours as TimeRange)}
//                             className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                               timeRange === hours
//                                 ? 'bg-cyan-600 text-white'
//                                 : theme === 'dark'
//                                 ? 'text-slate-300 hover:bg-slate-600'
//                                 : 'text-slate-600 hover:bg-slate-200'
//                             }`}
//                           >
//                             {hours}h
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     <ResponsiveContainer width="100%" height={400}>
//                       <LineChart data={trendData}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//                         <XAxis dataKey="time" stroke="#94a3b8" />
//                         <YAxis stroke="#94a3b8" />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: '#1e293b',
//                             border: '1px solid #475569',
//                             borderRadius: '8px',
//                           }}
//                           labelStyle={{ color: '#f1f5f9' }}
//                           formatter={(value: number) => value.toFixed(1)}
//                         />
//                         <Legend wrapperStyle={{ paddingTop: '20px' }} />
//                         <Line
//                           type="monotone"
//                           dataKey="O3"
//                           stroke="#06b6d4"
//                           strokeWidth={3}
//                           dot={false}
//                           isAnimationActive={true}
//                           name="O₃ (ppb)"
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="NO2"
//                           stroke="#2563eb"
//                           strokeWidth={3}
//                           dot={false}
//                           isAnimationActive={true}
//                           name="NO₂ (ppb)"
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="PM25"
//                           stroke="#f97316"
//                           strokeWidth={2}
//                           dot={false}
//                           isAnimationActive={true}
//                           strokeDasharray="5 5"
//                           name="PM2.5 (µg/m³)"
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="PM10"
//                           stroke="#ef4444"
//                           strokeWidth={2}
//                           dot={false}
//                           isAnimationActive={true}
//                           strokeDasharray="8 4"
//                           name="PM10 (µg/m³)"
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>

//                   {/* Pollutant Gauges Grid */}
//                   <div>
//                     <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Today's AQI</h2>
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                       {pollutantMetrics && (
//                         <>
//                           <PollutantGauge 
//                             name="PM2.5"
//                             value={pollutantMetrics.PM25}
//                             maxValue={150}
//                             unit="µg/m³"
//                             color="#f59e0b"
//                           />
//                           <PollutantGauge 
//                             name="PM10"
//                             value={pollutantMetrics.PM10}
//                             maxValue={250}
//                             unit="µg/m³"
//                             color="#f97316"
//                           />
//                           <PollutantGauge 
//                             name="NO₂"
//                             value={liveData?.predictions[0].NO2_target || 0}
//                             maxValue={200}
//                             unit="ppb"
//                             color="#3b82f6"
//                           />
//                           <PollutantGauge 
//                             name="SO₂"
//                             value={pollutantMetrics.SO2}
//                             maxValue={150}
//                             unit="ppb"
//                             color="#fbbf24"
//                           />
//                           <PollutantGauge 
//                             name="CO"
//                             value={pollutantMetrics.CO}
//                             maxValue={5000}
//                             unit="ppm"
//                             color="#ef4444"
//                           />
//                           <PollutantGauge 
//                             name="O₃"
//                             value={liveData?.predictions[0].O3_target || 0}
//                             maxValue={150}
//                             unit="ppb"
//                             color="#06b6d4"
//                           />
//                           <PollutantGauge 
//                             name="PM1"
//                             value={pollutantMetrics.PM1}
//                             maxValue={50}
//                             unit="µg/m³"
//                             color="#ec4899"
//                           />
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* Highest Pollutants */}
//                   <HighestPollutants
//                     o3Events={[
//                       { name: 'Central', location: 'Delhi/National Capital Region', value: '85 µg/m³' },
//                       { name: 'East', location: 'Delhi/National Capital Region', value: '82 µg/m³' },
//                       { name: 'South', location: 'Delhi/National Capital Region', value: '78 µg/m³' },
//                     ]}
//                     no2Events={[
//                       { name: 'Central', location: 'Delhi/National Capital Region', value: '95 µg/m³' },
//                       { name: 'North', location: 'Delhi/National Capital Region', value: '92 µg/m³' },
//                       { name: 'West', location: 'Delhi/National Capital Region', value: '88 µg/m³' },
//                     ]}
//                   />

//                   {/* Station Info */}
//                   {liveData?.live_source && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
//                         <div className="flex items-center gap-2 mb-4">
//                           <MapPin className="w-5 h-5 text-cyan-500" />
//                           <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Station Information</h3>
//                         </div>
//                         <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
//                           <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Station:</span> {liveData.live_source.station_name}</p>
//                           <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Location:</span> {liveData.live_source.station_location[0].toFixed(4)}°N, {liveData.live_source.station_location[1].toFixed(4)}°E</p>
//                           <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>AQI:</span> <span className="text-amber-400 font-semibold">{liveData.live_source.overall_aqi}</span></p>
//                         </div>
//                       </div>

//                       <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
//                         <div className="flex items-center gap-2 mb-4">
//                           <Clock className="w-5 h-5 text-cyan-500" />
//                           <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Measurement Time</h3>
//                         </div>
//                         <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
//                           <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Time:</span> {liveData.live_source.measurement_time}</p>
//                           <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Timezone:</span> {liveData.live_source.timezone}</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {activeTab === 'forecast' && forecastData && (
//                 <ForecastChart data={forecastData} siteId={selectedSite} />
//               )}

//               {activeTab === 'tool' && (
//                 <InteractiveForecastTool
//                   siteId={selectedSite}
//                   onForecastGenerated={setForecastData}
//                 />
//               )}

//               {activeTab === 'evaluation' && (
//                 <ModelEvaluation />
//               )}

//               {activeTab === 'health' && healthStatus && modelDetail && (
//                 <HealthStatus 
//                   healthStatus={healthStatus}
//                   modelDetail={modelDetail}
//                 />
//               )}
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }


'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { RefreshCw, AlertCircle, Clock, MapPin } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  LivePredictionResponse, 
  ModelHealthResponse, 
  PredictResponse,
  ModelDetailResponse 
} from '@shared/api';
import { 
  generateDummyLivePrediction,
  generateDummy24HourForecast,
  generateDummyHealthStatus,
  generateDummyModelDetail,
  generateDummyPollutantMetrics,
  PollutantMetrics,
} from '@/services/dummyData';
import { Button } from '@/components/ui/button';
import OverviewMetrics from '@/components/OverviewMetrics';
import PollutantGauge from '@/components/PollutantGauge';
import HighestPollutants from '@/components/HighestPollutants';
import SiteSelector from '@/components/SiteSelector';
import ForecastChart from '@/components/ForecastChart';
import InteractiveForecastTool from '@/components/InteractiveForecastTool';
import HealthStatus from '@/components/HealthStatus';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { L } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';
type TabType = 'overview' | 'health' ;
type TimeRange = 1 | 24 | 48;

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [selectedSite, setSelectedSite] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  
  // Data states
  const [liveData, setLiveData] = useState<LivePredictionResponse | null>(null);
  const [forecastData, setForecastData] = useState<PredictResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<ModelHealthResponse | null>(null);
  const [modelDetail, setModelDetail] = useState<ModelDetailResponse | null>(null);
  const [pollutantMetrics, setPollutantMetrics] = useState<PollutantMetrics | null>(null);

  // Fetch all data
  const fetchAllData = async (siteId: number, hours: TimeRange = 24) => {
    try {
      setLoading(true);
      setError(null);

      const [live, forecast, health, detail, metrics] = await Promise.all([
        Promise.resolve(generateDummyLivePrediction(siteId)),
        Promise.resolve(generateDummy24HourForecast(siteId, hours)),
        Promise.resolve(generateDummyHealthStatus()),
        Promise.resolve(generateDummyModelDetail(siteId)),
        Promise.resolve(generateDummyPollutantMetrics()),
      ]);

      setLiveData(live);
      setForecastData(forecast);
      setHealthStatus(health);
      setModelDetail(detail);
      setPollutantMetrics(metrics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSiteChange = (siteId: number) => {
    setSelectedSite(siteId);
  };

  const handleRefresh = () => {
    fetchAllData(selectedSite);
  };

  // Update activeTab based on activeNav
  useEffect(() => {
    if (activeNav === 'dashboard') {
      setActiveTab('overview');
    }
  }, [activeNav]);

  // Initial fetch
  useEffect(() => {
    fetchAllData(selectedSite, timeRange);
  }, [selectedSite, timeRange]);

  // Generate trend chart data
  const generateTrendData = () => {
    const hours = timeRange;
    const now = new Date();
    const data = [];

    for (let i = 0; i < hours; i++) {
      const hour = (now.getHours() + i) % 24;
      const timeOfDay = hour / 24;
      
      const o3Base = Math.sin((timeOfDay - 0.25) * Math.PI);
      const o3Value = 35 + (o3Base * 40 + 20) + (Math.random() - 0.5) * 10;
      const no2Morning = Math.sin((timeOfDay - 0.2) * Math.PI * 2) * 30;
      const no2Evening = Math.sin((timeOfDay - 0.8) * Math.PI * 2) * 35;
      const no2Value = 50 + (no2Morning + no2Evening) / 2 + (Math.random() - 0.5) * 8;
      const pm25Base = Math.cos(timeOfDay * Math.PI * 2) * 0.5 + 0.5;
      const pm25Value = 35 + pm25Base * 60 + (Math.random() - 0.5) * 12;
      const pm10Value = 65 + pm25Base * 90 + (Math.random() - 0.5) * 15;
      const hchoValue = 10 + (Math.random() - 0.5) * 2;
      const coValue = 50 + (Math.random() - 0.5) * 20;

      data.push({
        time: `${String(hour).padStart(2, '0')}:00`,
        O3: Math.max(5, Math.round(o3Value * 10) / 10),
        NO2: Math.max(10, Math.round(no2Value * 10) / 10),
        HCHO: Math.max(1, Math.round(hchoValue * 10) / 10),
        CO: Math.max(100, Math.round(coValue * 10) / 10),
        PM25: Math.max(5, Math.round(pm25Value * 10) / 10),
        PM10: Math.max(10, Math.round(pm10Value * 10) / 10),
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* Main Content */}
      <main className="flex-1 ">
        <Header 
          title="Air Quality Overview"
          subtitle="Current gases levels across all 7 regions of Delhi."
          onRefresh={handleRefresh}
          loading={loading}
          showRefresh={true}
          theme={theme}
          onThemeToggle={toggleTheme}
        />
        
        {/* Content */}
        <div className={`p-8 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          {error && (
            <div className={`mb-6 p-4 border rounded-lg flex items-start gap-3 ${theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-300'}`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} />
              <div className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>
                <p className="font-semibold">Error</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-500 mx-auto mb-4" />
                <p className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Loading data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Overview Metrics */}
                  {liveData && pollutantMetrics && (
                    <OverviewMetrics
                      o3={liveData.predictions[0].O3_target}
                      no2={liveData.predictions[0].NO2_target}
                      hcho={liveData.predictions[0].HCHO_target}
                      co = {liveData.predictions[0].CO_target}
                      pm25={liveData.predictions[0].PM25_target}
                      pm10={liveData.predictions[0].PM10_target}
                      o3Trend={-5}
                      no2Trend={3}
                      hchoTrend={-2}
                      coTrend={1}
                      pm25Trend={4}
                      pm10Trend={-3}
                    />
                  )}

                  {/* Time Range Selector & Trend Chart */}
                  <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Pollution Trends</h2>
                      <div className={`flex gap-2 rounded-lg p-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        {[1, 24, 48].map((hours) => (
                          <button
                            key={hours}
                            onClick={() => setTimeRange(hours as TimeRange)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                              timeRange === hours
                                ? 'bg-cyan-600 text-white'
                                : theme === 'dark'
                                ? 'text-slate-300 hover:bg-slate-600'
                                : 'text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {hours}h
                          </button>
                        ))}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                          }}
                          labelStyle={{ color: '#f1f5f9' }}
                          formatter={(value: number) => value.toFixed(1)}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="O3" stroke="#06b6d4" strokeWidth={3} dot={false} isAnimationActive={true} name="O₃ (ppb)" />
                        <Line type="monotone" dataKey="NO2" stroke="#2563eb" strokeWidth={3} dot={false} isAnimationActive={true} name="NO₂ (ppb)" />
                        <Line type="monotone" dataKey="HCHO" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={true} strokeDasharray="3 3" name="HCHO (ppb)" />
                        <Line type="monotone" dataKey="CO" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={true} strokeDasharray="2 2" name="CO (ppm)" />
                        <Line type="monotone" dataKey="PM25" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={true} strokeDasharray="5 5" name="PM2.5 (µg/m³)" />
                        <Line type="monotone" dataKey="PM10" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={true} strokeDasharray="8 4" name="PM10 (µg/m³)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pollutant Gauges Grid - FIXED HERE */}
                  <div>
                    <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Today's AQI</h2>
                    {/* UPDATED GRID CLASS below for better spacing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                      {pollutantMetrics && (
                        <>
                          <PollutantGauge name="O₃" value={liveData?.predictions[0].O3_target || 0} maxValue={150} unit="ppb" color="#06b6d4" />  
                          <PollutantGauge name="NO₂" value={liveData?.predictions[0].NO2_target || 0} maxValue={200} unit="ppb" color="#3b82f6" />
                          <PollutantGauge name="HCHO" value={liveData?.predictions[0].HCHO_target || 0} maxValue={150} unit="ppb" color="#fbbf24" />
                          <PollutantGauge name="CO" value={liveData?.predictions[0].CO_target || 0} maxValue={5000} unit="ppm" color="#ef4444" />
                          <PollutantGauge name="PM2.5" value={liveData?.predictions[0].PM25_target || 0} maxValue={150} unit="µg/m³" color="#f59e0b" />
                          <PollutantGauge name="PM10" value={liveData?.predictions[0].PM10_target || 0} maxValue={250} unit="µg/m³" color="#f97316" />
                          </>
                      )}
                    </div>
                  </div>

                  {/* Highest Pollutants */}
                  <HighestPollutants
                    o3Events={[
                      { name: 'Central', location: 'Delhi/National Capital Region', value: '85 µg/m³' },
                      { name: 'East', location: 'Delhi/National Capital Region', value: '82 µg/m³' },
                      { name: 'South', location: 'Delhi/National Capital Region', value: '78 µg/m³' },
                    ]}
                    no2Events={[
                      { name: 'Central', location: 'Delhi/National Capital Region', value: '95 µg/m³' },
                      { name: 'North', location: 'Delhi/National Capital Region', value: '92 µg/m³' },
                      { name: 'West', location: 'Delhi/National Capital Region', value: '88 µg/m³' },
                    ]}
                  />

                  {/* Station Info */}
                  {liveData?.live_source && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-cyan-500" />
                          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Station Information</h3>
                        </div>
                        <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Station:</span> {liveData.live_source.station_name}</p>
                          <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Location:</span> {liveData.live_source.station_location[0].toFixed(4)}°N, {liveData.live_source.station_location[1].toFixed(4)}°E</p>
                          <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>AQI:</span> <span className="text-amber-400 font-semibold">{liveData.live_source.overall_aqi}</span></p>
                        </div>
                      </div>

                      <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="w-5 h-5 text-cyan-500" />
                          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Measurement Time</h3>
                        </div>
                        <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Time:</span> {liveData.live_source.measurement_time}</p>
                          <p><span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Timezone:</span> {liveData.live_source.timezone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Other Tab Content (Health, etc.) */}
              {activeTab === 'health' && healthStatus && modelDetail && (
                <HealthStatus 
                  healthStatus={healthStatus}
                  modelDetail={modelDetail}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}