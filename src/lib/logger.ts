type LogLevel = "INFO" | "WARN" | "ERROR";

function log(level: LogLevel, message: string, data?: unknown) {
  const timestamp = new Date().toISOString();

  if (data !== undefined) {
    console[level === "ERROR" ? "error" : "log"](
      `[${timestamp}] [${level}] ${message}`,
      data
    );
  } else {
    console[level === "ERROR" ? "error" : "log"](
      `[${timestamp}] [${level}] ${message}`
    );
  }
}

export const logger = {
  info: (msg: string, data?: unknown) => log("INFO", msg, data),
  warn: (msg: string, data?: unknown) => log("WARN", msg, data),
  error: (msg: string, data?: unknown) => log("ERROR", msg, data),
};