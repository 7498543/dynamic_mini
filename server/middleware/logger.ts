import { readBody, getQuery } from "h3";
import { createLogger } from "#server/utils/logger";

export default defineEventHandler(async (event) => {
  const logger = createLogger();

  // 记录请求开始时间
  const startTime = Date.now();

  // 获取请求信息
  const url = event.node.req.url;
  const method = event.node.req.method;
  const headers = event.headers;
  const clientIp = event.node.req.socket.remoteAddress || "unknown";

  // 获取请求参数
  const query = getQuery(event);
  let body = {};

  // 尝试读取请求体（仅适用于POST等方法）
  try {
    body = (await readBody(event)) || {};
  } catch (e) {
    // 忽略读取请求体的错误
  }

  logger.info("Incoming request", {
    method,
    url,
    query,
    body: Object.keys(body).length > 0 ? body : undefined,
    clientIp,
    headers: {
      "user-agent": headers.get("user-agent"),
      "content-type": headers.get("content-type"),
    },
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
    });
  });

  // 中间件不需要返回任何值，会自动继续处理请求
});
