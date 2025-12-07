export interface CSVRow {
  year: number;
  month: number;
  day: number;
  hour: number;
  O3_target: number;
  NO2_target: number;
  HCHO_satellite?: number;
  CO?: number;
  PM25?: number;
  PM10?: number;
  [key: string]: number | undefined;
}

export interface ChartDataPoint {
  time: string;
  O3: number;
  NO2: number;
  HCHO: number;
  CO: number;
  PM25: number;
  PM10: number;
}

export const parseCSV = async (filePath: string): Promise<CSVRow[]> => {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    const lines = text.trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error('CSV file is empty or has no data');
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Find column indices
    const getIndex = (name: string) => headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
    
    const data: CSVRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < headers.length) continue;
      
      const row: CSVRow = {
        year: parseFloat(values[getIndex('year')] || '0'),
        month: parseFloat(values[getIndex('month')] || '0'),
        day: parseFloat(values[getIndex('day')] || '0'),
        hour: parseFloat(values[getIndex('hour')] || '0'),
        O3_target: parseFloat(values[getIndex('O3_target')] || '0') || 0,
        NO2_target: parseFloat(values[getIndex('NO2_target')] || '0') || 0,
      };

      // Try to find HCHO (could be HCHO_satellite or HCHO_target)
      const hchoIndex = getIndex('HCHO_satellite') !== -1 
        ? getIndex('HCHO_satellite') 
        : getIndex('HCHO_target');
      if (hchoIndex !== -1 && values[hchoIndex] && values[hchoIndex].trim() !== '') {
        const hchoValue = parseFloat(values[hchoIndex]);
        if (!isNaN(hchoValue)) {
          row.HCHO_satellite = hchoValue;
        }
      }

      // Try to find CO
      const coIndex = getIndex('CO_target') !== -1 
        ? getIndex('CO_target') 
        : getIndex('CO');
      if (coIndex !== -1) {
        row.CO = parseFloat(values[coIndex] || '0') || 0;
      }

      // Try to find PM2.5
      const pm25Index = getIndex('PM25_target') !== -1 
        ? getIndex('PM25_target') 
        : getIndex('PM2.5_target') !== -1
        ? getIndex('PM2.5_target')
        : getIndex('PM25');
      if (pm25Index !== -1) {
        row.PM25 = parseFloat(values[pm25Index] || '0') || 0;
      }

      // Try to find PM10
      const pm10Index = getIndex('PM10_target') !== -1 
        ? getIndex('PM10_target') 
        : getIndex('PM10');
      if (pm10Index !== -1) {
        row.PM10 = parseFloat(values[pm10Index] || '0') || 0;
      }

      data.push(row);
    }

    return data;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
};

export const convertToChartData = (csvData: CSVRow[], limit?: number): ChartDataPoint[] => {
  let data = csvData;
  
  // If limit is specified, take the last N rows (most recent data)
  if (limit) {
    data = csvData.slice(-limit);
  }
  
  return data.map((row, idx) => {
    // Format time from hour (0-23) to "HH:00" format
    const hour = Math.floor(row.hour);
    // For 48-hour data, add "Day 1" or "Day 2" prefix to ensure unique labels
    let timeStr = `${String(hour).padStart(2, '0')}:00`;
    if (limit === 48) {
      const day = Math.floor(idx / 24) + 1;
      timeStr = `Day ${day} ${timeStr}`;
    }
    
    return {
      time: timeStr,
      O3: row.O3_target || 0,
      NO2: row.NO2_target || 0,
      HCHO: row.HCHO_satellite || 0,
      CO: row.CO || 0,
      PM25: row.PM25 || 0,
      PM10: row.PM10 || 0,
    };
  });
};

