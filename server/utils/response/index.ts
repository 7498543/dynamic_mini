// 状态码定义
export const StatusCode = {
  SUCCESS: 2000,
  CREATED: 2001,
  REDIRECT: 301,
  BAD_REQUEST: 4000,
  UNAUTHORIZED: 4001,
  FORBIDDEN: 4003,
  NOT_FOUND: 404,
  SERVER_ERROR: 5000,
} as const;

// 响应接口
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  timestamp: number;
}

/**
 * 成功响应
 * @param data - 响应数据
 * @param msg - 响应消息
 * @returns 成功响应
 */
export function successResponse<T = any>(
  data: T,
  msg = "Success",
): ApiResponse<T> {
  return createApiResponse(StatusCode.SUCCESS, data, msg);
}

/**
 * 创建响应
 * @param data - 响应数据
 * @param msg - 响应消息
 * @returns 创建响应
 */
export function createResponse<T = any>(
  data: T,
  msg = "Success",
): ApiResponse<T> {
  return createApiResponse(StatusCode.CREATED, data, msg);
}

/**
 * 错误响应
 * @param code - 状态码
 * @param msg - 响应消息
 * @returns 错误响应
 */
export function errorResponse(
  code: number,
  msg: string = "Error",
): ApiResponse<null> {
  return createApiResponse(code, null, msg);
}

/**
 * 未授权响应
 * @param msg - 响应消息
 * @returns 未授权响应
 */
export function notAuthorizedResponse(
  msg: string = "Not authorized",
): ApiResponse<null> {
  return errorResponse(StatusCode.UNAUTHORIZED, msg);
}

/**
 * 404 响应
 * @param msg - 响应消息
 * @returns 404 响应
 */
export function notFoundResponse(msg: string = "Not found"): ApiResponse<null> {
  return errorResponse(StatusCode.NOT_FOUND, msg);
}

/**
 * 响应工厂函数
 * @param code - 状态码
 * @param data - 响应数据
 * @param msg - 响应消息
 * @returns 响应
 */
function createApiResponse<T = any>(
  code: number,
  data: T,
  msg = "",
): ApiResponse<T> {
  return {
    code,
    data,
    msg,
    timestamp: Date.now(),
  };
}
