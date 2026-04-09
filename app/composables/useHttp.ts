import type { UseFetchOptions } from "#app";

interface HttpOptions<O = any> extends UseFetchOptions<O> {
  sucCode: number[];
  errCode: number[];
  errField: string;
  dataField: string;
  completeData: boolean;
}

const defaultOptions: HttpOptions = {
  sucCode: [200, 201],
  errCode: [400, 401, 403, 404, 500],
  errField: "error",
  dataField: "data",
  completeData: true,
};

function mergeOptions(options: Partial<HttpOptions> = {}): HttpOptions {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  // 合并headers
  if (options?.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers.set(key, value);
      });
    } else if (typeof options.headers === "object" && options.headers !== null) {
      if (Array.isArray(options.headers)) {
        options.headers.forEach((value) => {
          if (Array.isArray(value) && value.length >= 2) {
            headers.set(value[0], value[1]);
          }
        });
      } else {
        Object.keys(options.headers).forEach((key) => {
          const value = options.headers[key];
          if (value !== undefined) {
            headers.set(key, String(value));
          }
        });
      }
    }
  }

  return {
    ...defaultOptions,
    ...options,
    headers,
  };
}

export function useHttp<T = any>(url: string, options: Partial<HttpOptions> = {}) {
  const config = useRuntimeConfig();

  const {
    dataField,
    completeData,
    errField,
    ...mergedOptions
  } = mergeOptions(options);

  return $fetch<T>(url, mergedOptions)
    .then((res) => {
      if (completeData && typeof res === "object" && res !== null) {
        return (res as any)[dataField] as T;
      }
      return res;
    })
    .catch((error) => {
      // 增强错误处理
      const errorMessage = error?.response?.data?.[errField] || error?.message || "请求失败";
      console.error(`HTTP请求错误 [${url}]:`, errorMessage);
      throw new Error(errorMessage);
    });
}
