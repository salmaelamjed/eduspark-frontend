import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Types
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

interface ApiConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
}
class Api {
  private readonly client: AxiosInstance;
  private readonly baseURL: string;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials || false,
      headers: {
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // You can add custom logic here before request is sent
        // Example: Add timestamp to prevent caching
        if (config.method === "get") {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      this.handleError,
    );
  }

  private handleError = async (
    error: AxiosError<ApiErrorResponse>,
  ): Promise<never> => {
    // Handle network errors
    if (!error.response) {
      throw new Error("Network error. Please check your connection.");
    }

    const { response } = error;
    const { status, data } = response;

    // Handle specific HTTP status codes
    switch (status) {
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.handleForbidden();
        break;
      case 422:
        this.handleValidationError(data);
        break;
      case 500:
        this.handleServerError();
        break;
      default:
        break;
    }

    // Format error message
    const errorMessage =
      data?.message || error.message || "An unexpected error occurred";
    const customError = new Error(errorMessage) as any;
    customError.status = status;
    customError.data = data;
    customError.errors = data?.errors;

    throw customError;
  };

  private handleUnauthorized(): void {
    // Implement your unauthorized logic (e.g., redirect to login)
    console.warn("Unauthorized access");
    // window.location.href = '/login';
  }

  private handleForbidden(): void {
    console.warn("Forbidden access");
  }

  private handleValidationError(data: ApiErrorResponse): void {
    console.warn("Validation error", data.errors);
  }

  private handleServerError(): void {
    console.error("Server error");
  }

  private createHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    token?: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const headers = this.createHeaders(token);

      // Check if data is FormData to let browser set content-type with boundary
      const isFormData = data instanceof FormData;

      const response = await this.client.request<T>({
        method,
        url: endpoint,
        data: isFormData ? data : data,
        headers: {
          ...headers,
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...config?.headers,
        },
        ...config,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Public methods with generics
  async get<T>(
    endpoint: string,
    token?: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, token, config);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>("POST", endpoint, data, token, config);
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, data, token, config);
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, data, token, config);
  }

  async delete<T>(
    endpoint: string,
    token?: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, token, config);
  }

  // Utility methods
  async upload<T>(
    endpoint: string,
    file: File | FormData,
    token?: string,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<T> {
    let formData: FormData;

    if (file instanceof File) {
      formData = new FormData();
      formData.append("file", file);
    } else {
      formData = file;
    }

    return this.post<T>(endpoint, formData, token, {
      onUploadProgress,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async download(
    endpoint: string,
    token?: string,
    filename?: string,
  ): Promise<void> {
    const response = await this.client.get(endpoint, {
      headers: this.createHeaders(token),
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || "download");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

// Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create and export singleton instance
export const apiClient = new Api({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
});

// Optional: Create specialized clients for different purposes
export const authClient = new Api({
  baseURL: `${API_URL}/auth`,
  timeout: 10000,
});

export const publicClient = new Api({
  baseURL: API_URL,
  timeout: 15000,
});