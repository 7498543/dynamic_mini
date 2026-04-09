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
  winston.format.json(), // JSON格式（便于解析）
  winston.format.printf(({ timestamp, level, message, pid }) => {
    // 自定义输出格式
    return `[${timestamp}] [${pid}] [${level.toUpperCase()}]: ${message}`;
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
    maxSize: "20m", // 每个日志文件最大20MB
    maxFiles: "7d", // 保留7天的日志
    format, // 复用上面定义的格式
  }),

  // 输出到文件（只记录error级别的日志）
  new DailyRotateFile({
    filename: "logs/%DATE%-error.log", // 日志文件名格式（包含日期）
    datePattern: "YYYY-MM-DD", // 日期格式
    zippedArchive: true, // 压缩旧日志
    maxSize: "20m", // 每个日志文件最大20MB
    maxFiles: "14d", // 保留14天的日志
    level: "error", // 只记录error级别的日志
    format, // 复用上面定义的格式
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels,
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
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
