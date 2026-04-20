import { readBody, getQuery } from "h3";
import { createLogger } from "#server/utils/logger";

export default defineEventHandler(async (event) => {
  const logger = createLogger();

  // 记录请求开始时间
  const startTime = Date.now();

  // 获取请求信息
  const url = event.node.req.url || "";
  const method = event.node.req.method || "UNKNOWN";
  const clientIp = 
    event.node.req.socket.remoteAddress || 
    event.node.req.headers["x-forwarded-for"] || 
    "unknown";

  // 获取请求头信息
  const userAgent = event.node.req.headers["user-agent"] || "unknown";
  const contentType = event.node.req.headers["content-type"];

  // 获取请求参数
  let query = {};
  try {
    query = getQuery(event);
  } catch (e) {
    logger.warn("Failed to parse query params", { url, error: e });
  }

  // 尝试读取请求体（仅适用于 POST 等方法）
  let body = {};
  if (["POST", "PUT", "PATCH"].includes(method)) {
    try {
      body = (await readBody(event)) || {};
    } catch (e) {
      logger.warn("Failed to read request body", { url, method, error: e });
    }
  }

  // 记录请求进入日志
  logger.info("Incoming request", {
    method,
    url,
    query: Object.keys(query).length > 0 ? query : undefined,
    body: Object.keys(body).length > 0 ? body : undefined,
    clientIp,
    userAgent,
    contentType,
    timestamp: new Date().toISOString(),
  });

  // 记录响应信息的中间件
  event.node.res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = event.node.res.statusCode || 200;

    logger.info("Request completed", {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      clientIp,
      timestamp: new Date().toISOString(),
    });
  });

  // 中间件不需要返回任何值，会自动继续处理请求
});
