type FetchLikeResponse = {
  ok: boolean;
  status: number;
  headers: {
    forEach(callback: (value: string, key: string) => void): void;
  };
  text(): Promise<string>;
};

export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface HttpClient {
  post<T>(path: string, body: unknown): Promise<HttpResponse<T>>;
}

export class HttpRequestError extends Error {
  status: number;
  response: {
    status: number;
    headers: Record<string, string>;
    data: unknown;
  };

  constructor(
    status: number,
    data: unknown,
    headers: Record<string, string>
  ) {
    super(resolveErrorMessage(status, data));
    this.name = 'HttpRequestError';
    this.status = status;
    this.response = { status, headers, data };
  }
}

interface HttpClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

const fetchFn = (globalThis as {
  fetch?: (
    input: string,
    init?: Record<string, unknown>
  ) => Promise<FetchLikeResponse>;
}).fetch;

if (!fetchFn) {
  throw new Error('Global fetch is not available in this runtime.');
}

function resolveRequestUrl(baseURL: string, path: string): string {
  if (!path) return baseURL;
  if (/^https?:\/\//.test(path)) return path;
  if (baseURL.endsWith('/') && path.startsWith('/')) {
    return `${baseURL.slice(0, -1)}${path}`;
  }
  if (!baseURL.endsWith('/') && !path.startsWith('/')) {
    return `${baseURL}/${path}`;
  }
  return `${baseURL}${path}`;
}

function parseBody(text: string): unknown {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function headersToRecord(
  headers: FetchLikeResponse['headers']
): Record<string, string> {
  const collected: Record<string, string> = {};
  headers.forEach((value, key) => {
    collected[key.toLowerCase()] = value;
  });
  return collected;
}

function resolveErrorMessage(status: number, data: unknown): string {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  const payload = data as
    | { error?: { message?: string } | string; message?: string }
    | null
    | undefined;

  if (typeof payload?.message === 'string') {
    return payload.message;
  }

  if (typeof payload?.error === 'string') {
    return payload.error;
  }

  if (
    typeof payload?.error === 'object' &&
    payload.error &&
    typeof payload.error.message === 'string'
  ) {
    return payload.error.message;
  }

  return `Request failed with status ${status}`;
}

export function createJsonHttpClient(config: HttpClientConfig): HttpClient {
  return {
    async post<T>(path: string, body: unknown): Promise<HttpResponse<T>> {
      const response = await fetchFn(resolveRequestUrl(config.baseURL, path), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers ?? {})
        },
        body: JSON.stringify(body)
      });

      const rawText = await response.text();
      const data = parseBody(rawText);
      const headers = headersToRecord(response.headers);

      if (!response.ok) {
        throw new HttpRequestError(response.status, data, headers);
      }

      return {
        data: data as T,
        status: response.status,
        headers
      };
    }
  };
}
