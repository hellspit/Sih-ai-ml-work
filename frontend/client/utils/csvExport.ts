import { PollutantMetrics } from '@/services/dummyData';

interface DataPoint {
  timestamp: Date;
  O3: number;
  NO2: number;
  PM1: number;
  PM25: number;
  PM10: number;
  SO2: number;
  CO: number;
  [key: string]: number | Date;
}

interface ReportData {
  siteName: string;
  siteId: number;
  interval: 'hourly' | 'daily' | '48h' | 'monthly';
  startDate: Date;
  endDate: Date;
  data: DataPoint[];
}

export const generateCSVContent = (report: ReportData): string => {
  const headers = [
    'Timestamp',
    'O3 (ppb)',
    'NO2 (ppb)',
    'PM1 (µg/m³)',
    'PM2.5 (µg/m³)',
    'PM10 (µg/m³)',
    'SO2 (ppb)',
    'CO (ppm)',
  ];

  const rows = report.data.map((point) => [
    point.timestamp.toISOString(),
    point.O3.toFixed(2),
    point.NO2.toFixed(2),
    point.PM1.toFixed(2),
    point.PM25.toFixed(2),
    point.PM10.toFixed(2),
    point.SO2.toFixed(2),
    point.CO.toFixed(2),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (report: ReportData): void => {
  const csvContent = generateCSVContent(report);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const dateStart = report.startDate.toISOString().split('T')[0];
  const dateEnd = report.endDate.toISOString().split('T')[0];
  const filename = `${report.siteName}_${report.interval}_${dateStart}_to_${dateEnd}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateDummyReportData = (
  siteName: string,
  siteId: number,
  interval: 'hourly' | 'daily' | '48h' | 'monthly',
  startDate: Date,
  endDate: Date
): DataPoint[] => {
  const data: DataPoint[] = [];
  const current = new Date(startDate);

  let intervalMs: number;
  if (interval === 'hourly') {
    intervalMs = 60 * 60 * 1000; // 1 hour
  } else if (interval === '48h') {
    intervalMs = 48 * 60 * 60 * 1000; // 48 hours
  } else if (interval === 'daily') {
    intervalMs = 24 * 60 * 60 * 1000; // 1 day
  } else {
    // monthly - use daily intervals
    intervalMs = 24 * 60 * 60 * 1000;
  }


   const baselineValues = {
    O3: 40,      // ppb
    NO2: 50,     // ppb
    PM1: 20,     // µg/m³
    PM25: 45,    // µg/m³
    PM10: 75,    // µg/m³
    SO2: 20,     // ppb
    CO: 700,     // ppb
  };

  const variationRanges = {
    O3: 20,
    NO2: 25,
    PM1: 15,
    PM25: 30,
    PM10: 40,
    SO2: 15,
    CO: 300,
  };


  while (current <= endDate) {
    const hour = current.getHours();
    const dayOfWeek = current.getDay();
    const timeOfDay = hour / 24;

    // Realistic patterns based on time of day
    const o3Pattern = Math.sin((timeOfDay - 0.25) * Math.PI);
    const no2Pattern = Math.sin((timeOfDay - 0.2) * Math.PI * 2);
    const pmPattern = Math.cos(timeOfDay * Math.PI * 2) * 0.5 + 0.5;

    // Weekend vs weekday variations
    const weekdayFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.85 : 1;

    data.push({
      timestamp: new Date(current),
      O3: Math.max(5, Math.round((35 + o3Pattern * 45 + Math.random() * 15) * 10) / 10),
      NO2: Math.max(
        10,
        Math.round((45 + no2Pattern * 35 * weekdayFactor + Math.random() * 12) * 10) / 10
      ),
      PM1: Math.max(5, Math.round((15 + pmPattern * 30 + Math.random() * 10) * 10) / 10),
      PM25: Math.max(
        5,
        Math.round((35 + pmPattern * 60 * weekdayFactor + Math.random() * 20) * 10) / 10
      ),
      PM10: Math.max(
        10,
        Math.round((65 + pmPattern * 90 * weekdayFactor + Math.random() * 30) * 10) / 10
      ),
      SO2: Math.max(5, Math.round((15 + no2Pattern * 25 + Math.random() * 8) * 10) / 10),
      CO: Math.max(100, Math.round((600 + no2Pattern * 400 + Math.random() * 200) * 10) / 10),
    });

    current.setTime(current.getTime() + intervalMs);
  }

  return data;
};
