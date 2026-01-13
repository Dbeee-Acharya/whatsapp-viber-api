/* eslint-disable no-console */

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

function getCallerContext() {
  const err = new Error();
  const stack = err.stack?.split("\n") ?? [];

  /**
   * stack[0] -> Error
   * stack[1] -> at getCallerContext
   * stack[2] -> at logger.<method>
   * stack[3] -> at actual caller
   */
  const callerLine = stack[3] || "";

  // Examples:
  // at UserService.createUser (/app/src/services/user.ts:42:15)
  // at /app/src/routes/auth.ts:18:5
  const match =
    callerLine.match(/at (.+) \((.+):(\d+):(\d+)\)/) ||
    callerLine.match(/at (.+):(\d+):(\d+)/);

  if (!match) {
    return "[WHATSAPP-VIBER-API]";
  }

  if (match.length === 5) {
    const [, fn, file, line] = match;
    return `[${fn}:${line}]`;
  }

  if (match.length === 4) {
    const [, file, line] = match;
    return `[${file}:${line}]`;
  }

  return "[WHATSAPP-VIBER-API]";
}

function formatMessage(level: LogLevel, args: unknown[]) {
  const context = getCallerContext();
  const prefix = `${context} ${level.toUpperCase()}`;

  return [prefix, ...args];
}

export const logger = {
  log: (...args: unknown[]) => console.log(...formatMessage("log", args)),

  info: (...args: unknown[]) => console.info(...formatMessage("info", args)),

  warn: (...args: unknown[]) => console.warn(...formatMessage("warn", args)),

  error: (...args: unknown[]) => console.error(...formatMessage("error", args)),

  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(...formatMessage("debug", args));
    }
  },
};
