import {
  PredictRequest,
  PredictResponse,
  LivePredictionResponse,
  HealthResponse,
  ModelHealthResponse,
  ModelDetailResponse,
} from "@shared/api";

const API_BASE_URL = "https://apiexample.com";

interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw {
          message: `API Error: ${response.statusText}`,
          status: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw { message: error.message } as ApiError;
      }
      throw error;
    }
  }

  /**
   * Health check - basic API status
   */
  async healthCheck(): Promise<HealthResponse> {
    return this.request("/api/v1/health/");
  }

  /**
   * Check which models are available
   */
  async healthCheckModels(): Promise<ModelHealthResponse> {
    return this.request("/api/v1/health/models");
  }

  /**
   * Check specific model details for a site
   */
  async healthCheckModelDetail(siteId: number): Promise<ModelDetailResponse> {
    return this.request(`/api/v1/health/models/${siteId}`);
  }

  /**
   * Predict for a specific site
   */
  async predictSite(
    siteId: number,
    request: PredictRequest
  ): Promise<PredictResponse> {
    return this.request(`/api/v1/predict/site/${siteId}`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Live prediction using WAQI feed for a specific site
   */
  async livePredictionSite(siteId: number): Promise<LivePredictionResponse> {
    return this.request(`/api/v1/predict/site/${siteId}/live`);
  }

  /**
   * Predict using unified model
   */
  async predictUnified(request: PredictRequest): Promise<PredictResponse> {
    return this.request("/api/v1/predict/unified", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  /**
   * Auto-detect model and predict
   */
  async predict(request: PredictRequest): Promise<PredictResponse> {
    return this.request("/api/v1/predict/", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
