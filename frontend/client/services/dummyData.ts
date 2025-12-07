import {
  LivePredictionResponse,
  PredictResponse,
  ModelHealthResponse,
  ModelDetailResponse,
} from "@shared/api";

export const generateDummyLivePrediction = (
  siteId: number
): LivePredictionResponse => {
  const now = new Date();
  const baseO3 = 30 + Math.random() * 50;
  const baseNO2 = 50 + Math.random() * 60;
  const baseHCHO = 5 + Math.random() * 15;
  const baseCO = 400 + Math.random() * 600;
  const basePM25 = 30 + Math.random() * 70;
  const basePM10 = 50 + Math.random() * 100;

  return {
    success: true,
    site_id: siteId,
    forecast_hours: 1,
    predictions: [
      {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        O3_target: Math.round(baseO3 * 10) / 10,
        NO2_target: Math.round(baseNO2 * 10) / 10,
        HCHO_target: Math.round(baseHCHO * 10) / 10,
        CO_target: Math.round(baseCO * 10) / 10,
        PM25_target: Math.round(basePM25 * 10) / 10,
        PM10_target: Math.round(basePM10 * 10) / 10,
      },
    ],
    message: `Live prediction generated using Site ${siteId} data`,
    live_source: {
      station_id: 10100 + siteId,
      station_name: getSiteName(siteId),
      station_location: getSiteLocation(siteId),
      measurement_time: now.toISOString().replace("T", " ").substring(0, 19),
      timezone: "+05:30",
      overall_aqi: Math.round(80 + Math.random() * 120),
      observed_no2: Math.round(baseNO2 * 10) / 10,
      observed_o3: Math.round(baseO3 * 10) / 10,
    },
  };
};

export interface PollutantMetrics {
  O3: number;
  NO2: number;
  HCHO: number;
  PM1: number;
  PM25: number;
  PM10: number;
  SO2: number;
  CO: number;
}

export const generateDummyPollutantMetrics = (): PollutantMetrics => {
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = hour / 24;

  // Generate realistic patterns for each pollutant
  const o3Pattern = Math.sin((timeOfDay - 0.25) * Math.PI);
  const no2Pattern = Math.sin((timeOfDay - 0.2) * Math.PI * 2);
  const pmPattern = Math.cos(timeOfDay * Math.PI * 2) * 0.5 + 0.5;

  return {
    O3: Math.round((35 + o3Pattern * 45 + Math.random() * 15) * 10) / 10,
    NO2: Math.round((45 + no2Pattern * 35 + Math.random() * 12) * 10) / 10,
    HCHO: Math.round((10 + o3Pattern * 20 + Math.random() * 5) * 10) / 10,
    PM1: Math.round((15 + pmPattern * 30 + Math.random() * 10) * 10) / 10,
    PM25: Math.round((35 + pmPattern * 60 + Math.random() * 20) * 10) / 10,
    PM10: Math.round((65 + pmPattern * 90 + Math.random() * 30) * 10) / 10,
    SO2: Math.round((15 + no2Pattern * 25 + Math.random() * 8) * 10) / 10,
    CO: Math.round((600 + no2Pattern * 400 + Math.random() * 200) * 10) / 10,
  };
};

// export const generateDummy24HourForecast = (
//   siteId: number,
//   hours: number = 24
// ): PredictResponse => {
//   const now = new Date();
//   const predictions = [];

//   for (let i = 0; i < hours; i++) {
//     const hour = (now.getHours() + i) % 24;
//     const dayOffset = Math.floor((now.getHours() + i) / 24);
//     const timeOfDay = hour / 24;

//     // Realistic O3 pattern: peaks in afternoon/evening (photochemical formation)
//     // Lower at night, rises in late morning, peaks around 2-4 PM
//     const o3BasePattern = Math.sin((timeOfDay - 0.25) * Math.PI);
//     const o3Jitter = (Math.random() - 0.5) * 15;
//     const o3Value = 35 + (o3BasePattern * 40 + 20) + o3Jitter;

//     // Realistic NO2 pattern: peaks during morning/evening rush hours
//     // Higher in early morning and evening, lower in afternoon
//     const no2Morning = Math.sin((timeOfDay - 0.2) * Math.PI * 2) * 30;
//     const no2Evening = Math.sin((timeOfDay - 0.8) * Math.PI * 2) * 35;
//     const no2Jitter = (Math.random() - 0.5) * 12;
//     const no2Value = 50 + (no2Morning + no2Evening) / 2 + no2Jitter;

//     predictions.push({
//       year: now.getFullYear(),
//       month: now.getMonth() + 1,
//       day: now.getDate() + dayOffset,
//       hour: hour,
//       O3_target: Math.max(5, Math.round(o3Value * 10) / 10),
//       NO2_target: Math.max(10, Math.round(no2Value * 10) / 10),
//     });
//   }
export const generateDummy24HourForecast = (
  siteId: number,
  hours: number = 24
): PredictResponse => {
  const now = new Date();
  const predictions = [];

  for (let i = 0; i < hours; i++) {
    const futureDate = new Date(now.getTime() + i * 60 * 60 * 1000);

    const hour = futureDate.getHours();
    const timeOfDay = hour / 24;

    /* -----------------------------
       OZONE (O₃) - realistic pattern
       -------------------------------
       - Lowest at night
       - Starts rising at 9–10 AM
       - Peaks between 2–4 PM
       ----------------------------- */
    const o3DailyCurve =
      Math.max(
        0,
        Math.sin((timeOfDay - 0.25) * Math.PI) // peak shift
      );

    const o3Value =
      20 +                   // base background
      o3DailyCurve * 50 +    // daily peak
      (Math.random() - 0.5) * 12; // noise

    /* -----------------------------
       NO2 - realistic pattern
       -------------------------------
       - High in morning (8–10 AM)
       - High in evening (6–9 PM)
       - Low afternoon due to photochemical loss
       ----------------------------- */
    const no2MorningPeak =
      Math.exp(-Math.pow((hour - 8) / 2, 2)) * 45; // Gaussian morning peak

    const no2EveningPeak =
      Math.exp(-Math.pow((hour - 19) / 2, 2)) * 40; // Gaussian evening peak

    const no2Value =
      25 + // background
      no2MorningPeak +
      no2EveningPeak +
      (Math.random() - 0.5) * 10;

    predictions.push({
      year: futureDate.getFullYear(),
      month: futureDate.getMonth() + 1,
      day: futureDate.getDate(),
      hour: hour,
      O3_target: Math.max(5, Math.round(o3Value * 10) / 10),
      NO2_target: Math.max(8, Math.round(no2Value * 10) / 10),
      HCHO_target: Math.max(2, Math.round((5 + Math.random() * 15) * 10) / 10),
      CO_target: Math.max(300, Math.round((400 + Math.random() * 600) * 10) / 10),
      PM25_target: Math.max(10, Math.round((30 + Math.random() * 70) * 10) / 10),
      PM10_target: Math.max(20, Math.round((50 + Math.random() * 100) * 10) / 10),
    
      siteId: siteId,
    });
  }

  


  return {
    success: true,
    site_id: siteId,
    forecast_hours: hours,
    predictions,
    message: `Successfully generated ${hours} predictions for site ${siteId}`,
  };
};

export const generateDummyHealthStatus = (): ModelHealthResponse => {
  return {
    success: true,
    message: "All systems operational",
    models: {
      site_1: { available: true, last_updated: new Date().toISOString() },
      site_2: { available: true, last_updated: new Date().toISOString() },
      site_3: { available: true, last_updated: new Date().toISOString() },
      site_4: { available: true, last_updated: new Date().toISOString() },
      site_5: { available: true, last_updated: new Date().toISOString() },
      site_6: { available: true, last_updated: new Date().toISOString() },
      site_7: { available: true, last_updated: new Date().toISOString() },
    },
  };
};

export const generateDummyModelDetail = (
  siteId: number
): ModelDetailResponse => {
  return {
    success: true,
    site_id: siteId,
    model_name: `XGBoost Ensemble v2.1 (Site ${siteId})`,
    features: [
      "year",
      "month",
      "day",
      "hour",
      "O3_forecast",
      "NO2_forecast",
      "T_forecast",
      "q_forecast",
      "u_forecast",
      "v_forecast",
      "w_forecast",
      "NO2_satellite",
      "HCHO_satellite",
      "ratio_satellite",
      "O3_target_lag1",
      "O3_target_lag24",
      "O3_target_lag168",
      "NO2_target_lag1",
      "NO2_target_lag24",
      "NO2_target_lag168",
    ],
    message: `Model loaded successfully for monitoring site ${siteId}`,
  };
};

const getSiteName = (siteId: number): string => {
  const names: { [key: number]: string } = {
    1: "Satyawati College, Delhi, Delhi, India",
    2: "RK Puram, Delhi, Delhi, India",
    3: "East Delhi, Delhi, Delhi, India",
    4: "North Delhi, Delhi, Delhi, India",
    5: "South Delhi, Delhi, Delhi, India",
    6: "West Delhi, Delhi, Delhi, India",
    7: "Central Delhi, Delhi, Delhi, India",
  };
  return names[siteId] || `Site ${siteId}, Delhi, India`;
};

const getSiteLocation = (siteId: number): [number, number] => {
  const locations: { [key: number]: [number, number] } = {
    1: [28.69572, 77.181295],
    2: [28.5244, 77.1855],
    3: [28.6124, 77.3052],
    4: [28.7515, 77.2269],
    5: [28.5355, 77.2063],
    6: [28.6692, 77.0438],
    7: [28.6329, 77.2197],
  };
  return locations[siteId] || [28.6139, 77.209];
};
