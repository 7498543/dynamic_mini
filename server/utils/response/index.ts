import { H3Event } from 'h3';
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
  event: H3Event,
  data: T,
  msg = 'Success'
): ApiResponse<T> {
  return createApiResponse(event, StatusCode.SUCCESS, data, msg);
}

/**
 * 无效请求错误响应
 * @param data - 响应数据
 * @param msg - 响应消息
 * @returns 无效请求错误响应
 */
export function badRequestResponse<T = any>(
  event: H3Event,
  data: T,
  msg = 'Bad request'
): ApiResponse<T> {
  return createApiResponse(event, StatusCode.BAD_REQUEST, data, msg);
}

/**
 * 创建响应
 * @param data - 响应数据
 * @param msg - 响应消息
 * @returns 创建响应
 */
export function createResponse<T = any>(
  event: H3Event,
  data: T,
  msg = 'Success'
): ApiResponse<T> {
  return createApiResponse(event, StatusCode.CREATED, data, msg);
}

/**
 * 错误响应
 * @param code - 状态码
 * @param msg - 响应消息
 * @returns 错误响应
 */
export function errorResponse(
  event: H3Event,
  code: number = StatusCode.BAD_REQUEST,
  msg: string = 'Error'
): ApiResponse<null> {
  return createApiResponse(event, code, null, msg);
}

/**
 * 未授权响应
 * @param msg - 响应消息
 * @returns 未授权响应
 */
export function notAuthorizedResponse(
  event: H3Event,
  msg: string = 'Not authorized'
): ApiResponse<null> {
  return errorResponse(event, StatusCode.UNAUTHORIZED, msg);
}

/**
 * 404 响应
 * @param msg - 响应消息
 * @returns 404 响应
 */
export function notFoundResponse(
  event: H3Event,
  msg: string = 'Not found'
): ApiResponse<null> {
  return errorResponse(event, StatusCode.NOT_FOUND, msg);
}

/**
 * 500 响应
 * @param msg - 响应消息
 * @returns 500 响应
 */
export function serverFaultResponse(
  event: H3Event,
  msg: string = 'Server fault'
): ApiResponse<null> {
  return errorResponse(event, StatusCode.SERVER_ERROR, msg);
}

/**
 * 响应工厂函数
 * @param code - 状态码
 * @param data - 响应数据
 * @param msg - 响应消息
 * @returns 响应
 */
function createApiResponse<T = any>(
  event: H3Event,
  code: number,
  data: T,
  msg = ''
): ApiResponse<T> {
  return {
    code,
    data,
    msg,
    timestamp: Date.now(),
  };
}
