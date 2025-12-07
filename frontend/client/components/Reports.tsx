// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Download, Calendar, MapPin, AlertCircle } from 'lucide-react';
// import { useTheme } from '@/contexts/ThemeContext';
// import { downloadCSV, generateDummyReportData } from '@/utils/csvExport';

// const SITES = [
//   { id: 1, name: 'Satyawati College' },
//   { id: 2, name: 'RK Puram' },
//   { id: 3, name: 'East Delhi' },
//   { id: 4, name: 'North Delhi' },
//   { id: 5, name: 'South Delhi' },
//   { id: 6, name: 'West Delhi' },
//   { id: 7, name: 'Central Delhi' },
// ];

// const INTERVALS = [
//   { id: 'hourly', label: 'Hourly', description: 'Hourly data points' },
//   { id: 'daily', label: 'Daily', description: 'Daily average data' },
//   { id: '48h', label: '48 Hour', description: '48-hour forecast data' },
//   { id: 'monthly', label: 'Monthly', description: 'Monthly summary data' },
// ];

// export default function Reports() {
//   const { theme } = useTheme();
//   const [selectedSites, setSelectedSites] = useState<number[]>([1]);
//   const [startDate, setStartDate] = useState<string>(
//     new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
//   );
//   const [endDate, setEndDate] = useState<string>(
//     new Date().toISOString().split('T')[0]
//   );
//   const [selectedIntervals, setSelectedIntervals] = useState<string[]>(['hourly']);
//   const [downloading, setDownloading] = useState(false);

//   const toggleSite = (siteId: number) => {
//     setSelectedSites((prev) =>
//       prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
//     );
//   };

//   const toggleInterval = (interval: string) => {
//     setSelectedIntervals((prev) =>
//       prev.includes(interval)
//         ? prev.filter((i) => i !== interval)
//         : [...prev, interval]
//     );
//   };

//   const handleDownload = async () => {
//     setDownloading(true);

//     try {
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       for (const siteId of selectedSites) {
//         const site = SITES.find((s) => s.id === siteId);
//         if (!site) continue;

//         for (const interval of selectedIntervals) {
//           const data = generateDummyReportData(site.name, siteId, interval as any, start, end);

//           downloadCSV({
//             siteName: `Site${siteId}_${site.name.replace(/\s+/g, '_')}`,
//             siteId,
//             interval: interval as any,
//             startDate: start,
//             endDate: end,
//             data,
//           });

//           // Add delay between downloads to prevent blocking
//           await new Promise((resolve) => setTimeout(resolve, 500));
//         }
//       }
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const isValid = selectedSites.length > 0 && selectedIntervals.length > 0 && startDate && endDate;

//   return (
//     <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
//       <div className={`sticky top-0 z-40 backdrop-blur border-b ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}>
//         <div className="px-8 py-6 flex items-center justify-between">
//           <div>
//             <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Reports & Downloads</h1>
//             <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Export air quality data in CSV format</p>
//           </div>
//         </div>
//       </div>

//       <div className={`p-8 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
//         <div className="space-y-6">
//           {/* Date Range Selection */}
//           <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
//             <div className="flex items-center gap-2 mb-4">
//               <Calendar className="w-5 h-5 text-cyan-500" />
//               <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Date Range</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Start Date</label>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
//                 />
//               </div>

//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>End Date</label>
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Site Selection */}
//           <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
//             <div className="flex items-center gap-2 mb-4">
//               <MapPin className="w-5 h-5 text-cyan-500" />
//               <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Select Sites</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {SITES.map((site) => (
//                 <button
//                   key={site.id}
//                   onClick={() => toggleSite(site.id)}
//                   className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
//                     selectedSites.includes(site.id)
//                       ? 'bg-cyan-600 border-cyan-600 text-white'
//                       : theme === 'dark'
//                       ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
//                       : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'
//                   }`}
//                 >
//                   <div>Site {site.id}</div>
//                   <div className="text-xs opacity-75 mt-1">{site.name}</div>
//                 </button>
//               ))}
//             </div>
//           </Card>

//           {/* Interval Selection */}
//           <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
//             <div className="flex items-center gap-2 mb-4">
//               <Download className="w-5 h-5 text-cyan-500" />
//               <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Data Intervals</h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {INTERVALS.map((interval) => (
//                 <button
//                   key={interval.id}
//                   onClick={() => toggleInterval(interval.id)}
//                   className={`p-4 rounded-lg border-2 transition-all ${
//                     selectedIntervals.includes(interval.id)
//                       ? 'bg-cyan-600 border-cyan-600 text-white'
//                       : theme === 'dark'
//                       ? 'bg-slate-700 border-slate-600 hover:border-slate-500'
//                       : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'
//                   }`}
//                 >
//                   <div className={`font-semibold ${selectedIntervals.includes(interval.id) ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{interval.label}</div>
//                   <div className={`text-xs mt-2 ${selectedIntervals.includes(interval.id) ? 'text-cyan-100' : theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{interval.description}</div>
//                 </button>
//               ))}
//             </div>
//           </Card>

//           {/* Summary & Download */}
//           <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
//             <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Download Summary</h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
//                 <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Selected Sites</p>
//                 <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{selectedSites.length}</p>
//                 <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
//                   {selectedSites.map((id) => {
//                     const site = SITES.find((s) => s.id === id);
//                     return site?.name;
//                   }).join(', ')}
//                 </p>
//               </div>

//               <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
//                 <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Data Intervals</p>
//                 <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{selectedIntervals.length}</p>
//                 <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
//                   {selectedIntervals.join(', ')}
//                 </p>
//               </div>

//               <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
//                 <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Total Files</p>
//                 <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
//                   {selectedSites.length * selectedIntervals.length}
//                 </p>
//                 <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>CSV files to download</p>
//               </div>
//             </div>

//             <div className={`rounded-lg p-4 mb-6 flex items-start gap-3 border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
//               <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
//               <div className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
//                 <p className="font-semibold mb-1">Information</p>
//                 <p>
//                   All pollutants (O₃, NO₂, PM1, PM2.5, PM10, SO₂, CO) are included in each CSV file.
//                   Timestamps are in UTC format.
//                 </p>
//               </div>
//             </div>

//             <Button
//               onClick={handleDownload}
//               disabled={!isValid || downloading}
//               className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 h-12 text-base"
//             >
//               <Download className="w-5 h-5" />
//               {downloading ? 'Downloading...' : 'Download CSV Files'}
//             </Button>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { downloadCSV, generateDummyReportData } from '@/utils/csvExport';
import Header from '@/components/Header'; // Imported Header

const SITES = [
  { id: 1, name: 'Satyawati College' },
  { id: 2, name: 'RK Puram' },
  { id: 3, name: 'East Delhi' },
  { id: 4, name: 'North Delhi' },
  { id: 5, name: 'South Delhi' },
  { id: 6, name: 'West Delhi' },
  { id: 7, name: 'Central Delhi' },
];

const INTERVALS = [
  { id: 'hourly', label: 'Hourly', description: 'Hourly data points' },
  { id: 'daily', label: 'Daily', description: 'Daily average data' },
  { id: '48h', label: '48 Hour', description: '48-hour forecast data' },
  { id: 'monthly', label: 'Monthly', description: 'Monthly summary data' },
];

export default function Reports() {
  const { theme, toggleTheme } = useTheme(); // Added toggleTheme
  const [selectedSites, setSelectedSites] = useState<number[]>([1]);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>(['hourly']);
  const [downloading, setDownloading] = useState(false);

  const toggleSite = (siteId: number) => {
    setSelectedSites((prev) =>
      prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
    );
  };

  const toggleInterval = (interval: string) => {
    setSelectedIntervals((prev) =>
      prev.includes(interval)
      ? prev.filter((i) => i !== interval)
      : [...prev, interval]
    );
  };

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (const siteId of selectedSites) {
        const site = SITES.find((s) => s.id === siteId);
        if (!site) continue;

        for (const interval of selectedIntervals) {
          const data = generateDummyReportData(site.name, siteId, interval as any, start, end);

          downloadCSV({
            siteName: `Site${siteId}_${site.name.replace(/\s+/g, '_')}`,
            siteId,
            interval: interval as any,
            startDate: start,
            endDate: end,
            data,
          });

          // Add delay between downloads to prevent blocking
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    } finally {
      setDownloading(false);
    }
  };

  const isValid = selectedSites.length > 0 && selectedIntervals.length > 0 && startDate && endDate;

  return (
    // Removed min-h-screen since Layout handles height
    <div className={`flex-1 flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* Replaced manual header with Component */}
      <Header 
        title="Reports & Downloads"
        subtitle="Export air quality data in CSV format"
        showRefresh={false} // No refresh button needed for reports
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <div className={`p-8 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="space-y-6">
          
          {/* Date Range Selection */}
          <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-cyan-500" />
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Date Range</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
            </div>
          </Card>

          {/* Site Selection */}
          <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-cyan-500" />
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Select Sites</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => toggleSite(site.id)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm text-left ${
                    selectedSites.includes(site.id)
                      ? 'bg-cyan-600 border-cyan-600 text-white'
                      : theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div>Site {site.id}</div>
                  <div className={`text-xs mt-1 ${selectedSites.includes(site.id) ? 'opacity-90' : 'opacity-75'}`}>{site.name}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Interval Selection */}
          <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-cyan-500" />
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Data Intervals</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {INTERVALS.map((interval) => (
                <button
                  key={interval.id}
                  onClick={() => toggleInterval(interval.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedIntervals.includes(interval.id)
                      ? 'bg-cyan-600 border-cyan-600 text-white'
                      : theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 hover:border-slate-500'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className={`font-semibold ${selectedIntervals.includes(interval.id) ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{interval.label}</div>
                  <div className={`text-xs mt-2 ${selectedIntervals.includes(interval.id) ? 'text-cyan-100' : theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{interval.description}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Summary & Download */}
          <Card className={`p-6 border ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white shadow-sm'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Download Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Selected Sites</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{selectedSites.length}</p>
                <p className={`text-xs mt-2 truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {selectedSites.map((id) => {
                    const site = SITES.find((s) => s.id === id);
                    return site?.name;
                  }).join(', ')}
                </p>
              </div>

              <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Data Intervals</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{selectedIntervals.length}</p>
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {selectedIntervals.join(', ')}
                </p>
              </div>

              <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Total Files</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {selectedSites.length * selectedIntervals.length}
                </p>
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>CSV files to download</p>
              </div>
            </div>

            <div className={`rounded-lg p-4 mb-6 flex items-start gap-3 border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                <p className="font-semibold mb-1">Information</p>
                <p>
                  All pollutants (O₃, NO₂, PM1, PM2.5, PM10, SO₂, CO) are included in each CSV file.
                  Timestamps are in UTC format.
                </p>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              disabled={!isValid || downloading}
              className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 h-12 text-base"
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Downloading...' : 'Download CSV Files'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}