import axios, { AxiosInstance } from 'axios';

const MARKET_BASE_URL = 'https://market.bery.in/';
const envBaseUrl = ((import.meta as any).env?.VITE_API_BASE_URL ?? '').toString().trim();
const resolvedBaseUrl = envBaseUrl || MARKET_BASE_URL;
const normalizedBaseUrl = resolvedBaseUrl.endsWith('/') ? resolvedBaseUrl : `${resolvedBaseUrl}/`;

const apiClient: AxiosInstance = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const isDev = !!(import.meta as any).env?.DEV;
if (isDev) {
  console.log('API Base URL:', normalizedBaseUrl);
}

type ZoneHeaderMode = 'single' | 'multi';

const shouldUseSingleZoneHeader = (url: string): boolean => {
  const normalized = url.toLowerCase();
  return normalized.includes('/api/v1/customer/');
};

const parseFiniteNumber = (value: unknown): number | null => {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeZoneHeaderValue = (raw: string, mode: ZoneHeaderMode): string | undefined => {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      const numeric = parsed.map(parseFiniteNumber).filter((n): n is number => n !== null);
      if (numeric.length === 0) return undefined;
      if (mode === 'single') return JSON.stringify([numeric[0]]);
      return JSON.stringify(numeric);
    }

    const asNum = parseFiniteNumber(parsed);
    if (asNum !== null) return mode === 'single' ? JSON.stringify([asNum]) : String(asNum);
    return String(parsed);
  } catch {
    const asNum = parseFiniteNumber(trimmed);
    if (asNum !== null) return mode === 'single' ? JSON.stringify([asNum]) : String(asNum);
    return trimmed;
  }
};

const normalizeModuleHeaderValue = (raw: string): string | undefined => {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const asNum = parseFiniteNumber(trimmed);
  if (asNum !== null) return String(asNum);
  return trimmed;
};

// Request interceptor to add auth token and optional zone/module headers
apiClient.interceptors.request.use(
  (config) => {
    if (isDev) {
      console.log('API Request:', config.method?.toUpperCase(), (config.baseURL || '') + (config.url || ''));
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['X-localization'] = localStorage.getItem('language') || 'en';

    const zoneId = localStorage.getItem('zoneId');
    if (zoneId) {
      const url = String(config.url ?? '');
      const mode: ZoneHeaderMode = shouldUseSingleZoneHeader(url) ? 'single' : 'multi';
      const normalized = normalizeZoneHeaderValue(zoneId, mode);
      if (normalized) {
        config.headers.zoneId = normalized;
      }
    }

    const moduleId = localStorage.getItem('moduleId');
    if (moduleId) {
      const normalized = normalizeModuleHeaderValue(moduleId);
      if (normalized) {
        config.headers.moduleId = normalized;
      }
    }

    if (isDev) {
      const url = String(config.url ?? '');
      const headersPreview = {
        zoneId: (config.headers as any)?.zoneId,
        moduleId: (config.headers as any)?.moduleId,
        hasAuthToken: !!token
      };
      console.log('API Headers:', headersPreview);

      if (url.includes('/api/v1/customer/order/place')) {
        let payload: any = config.data;
        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload); } catch { }
        }
        console.log('Order Place Payload:', {
          store_id: payload?.store_id,
          order_amount: payload?.order_amount,
          order_type: payload?.order_type,
          payment_method: payload?.payment_method
        });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    const isDev = !!(import.meta as any).env?.DEV;
    if (isDev) {
      console.log('API Response:', response.config.url, 'Status:', response.status);
    }
    return response;
  },
  (error) => {
    const normalize = (err: any): any => {
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        let msg = '';
        if (data) {
          if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            msg = data.errors.map((e: any) => e.message).join(', ');
          } else if (data.message) {
            msg = data.message;
          } else if (data.error) {
            msg = data.error;
          }
        }
        
        if (!msg) {
          msg = err.message || 'Request failed';
        }

        const newError: any = new Error(msg);
        
        newError.status = status;
        newError.response = err.response;
        newError.isAxiosError = true;
        newError.originalError = err;

        switch (status) {
          case 401:
            try { localStorage.removeItem('authToken'); } catch {}
            if (!msg || msg === 'Request failed') newError.message = 'Unauthorized';
            break;
          case 403:
            if (!msg || msg === 'Request failed') newError.message = 'Forbidden';
            break;
          case 404:
            if (!msg || msg === 'Request failed') newError.message = 'Not Found';
            break;
          case 500:
            if (!msg || msg === 'Request failed') newError.message = 'Server Error';
            break;
        }
        return newError;
      } else if (err.request) {
        return new Error('Network Error - No response received');
      } else {
        return new Error(err.message || 'Unknown Error');
      }
    };
    return Promise.reject(normalize(error));
  }
);

export default apiClient;
