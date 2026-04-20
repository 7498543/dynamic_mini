import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // 时间戳
  winston.format.printf(({ timestamp, level, message, pid, clientIp, method, url, statusCode, duration, userAgent, ...meta }) => {
    // 自定义输出格式
    const baseLog = `[${timestamp}] [${pid || "system"}] [${level.toUpperCase()}]: ${message}`;
    
    // 添加额外的字段
    const extraFields: string[] = [];
    if (clientIp) extraFields.push(`IP: ${clientIp}`);
    if (method) extraFields.push(`Method: ${method}`);
    if (url) extraFields.push(`URL: ${url}`);
    if (statusCode) extraFields.push(`Status: ${statusCode}`);
    if (duration) extraFields.push(`Duration: ${duration}`);
    if (userAgent) extraFields.push(`UA: ${userAgent}`);
    
    // 合并所有字段
    const extraLog = extraFields.length > 0 ? ` | ${extraFields.join(" | ")}` : "";
    
    // 如果有其他元数据，也添加进去
    const metaLog = Object.keys(meta).length > 0 ? ` | Meta: ${JSON.stringify(meta)}` : "";
    
    return `${baseLog}${extraLog}${metaLog}`;
  }),
);

const transports = [
  // 输出到控制台（开发环境用，颜色区分级别）
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(), // 颜色高亮
      format, // 复用上面定义的格式
    ),
  }),

  // 输出到文件
  new DailyRotateFile({
    filename: "logs/%DATE%.log", // 日志文件名格式（包含日期）
    datePattern: "YYYY-MM-DD", // 日期格式
    zippedArchive: true, // 压缩旧日志
    maxSize: "20m", // 每个日志文件最大 20MB
    maxFiles: "7d", // 保留 7 天的日志
    format, // 复用上面定义的格式
  }),

  // 输出到文件（只记录 error 级别的日志）
  new DailyRotateFile({
    filename: "logs/%DATE%-error.log", // 日志文件名格式（包含日期）
    datePattern: "YYYY-MM-DD", // 日期格式
    zippedArchive: true, // 压缩旧日志
    maxSize: "20m", // 每个日志文件最大 20MB
    maxFiles: "14d", // 保留 14 天的日志
    level: "error", // 只记录 error 级别的日志
    format, // 复用上面定义的格式
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels,
  defaultMeta: { service: "nuxt-app" },
  transports,
});

export function createLogger(meta?: {
  ip?: string;
  requestId?: string;
  userId?: string;
  route?: string;
}) {
  return logger.child(meta || {});
}

export default logger;
