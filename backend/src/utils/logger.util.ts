/**
 * Logger Utility Functions
 * 
 * Basic logging utility for the application.
 * Can be extended with winston or other logging libraries in the future.
 */

/**
 * Log levels
 */
enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

/**
 * Formats a log message with timestamp and level
 */
const formatLogMessage = (level: LogLevel, message: string, meta?: any): string => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

/**
 * Logs an informational message
 * @param message - The message to log
 * @param meta - Optional metadata to include
 */
export const logInfo = (message: string, meta?: any): void => {
  console.log(formatLogMessage(LogLevel.INFO, message, meta));
};

/**
 * Logs a warning message
 * @param message - The warning message to log
 * @param meta - Optional metadata to include
 */
export const logWarn = (message: string, meta?: any): void => {
  console.warn(formatLogMessage(LogLevel.WARN, message, meta));
};

/**
 * Logs an error message
 * @param message - The error message to log
 * @param error - Optional error object to include
 */
export const logError = (message: string, error?: any): void => {
  const errorMeta = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : error;
  
  console.error(formatLogMessage(LogLevel.ERROR, message, errorMeta));
};

/**
 * Logs a debug message (only in development)
 * @param message - The debug message to log
 * @param meta - Optional metadata to include
 */
export const logDebug = (message: string, meta?: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(formatLogMessage(LogLevel.DEBUG, message, meta));
  }
};

/**
 * Creates a logger instance for a specific module/context
 * @param context - The context/module name
 */
export const createLogger = (context: string) => {
  return {
    info: (message: string, meta?: any) => logInfo(`[${context}] ${message}`, meta),
    warn: (message: string, meta?: any) => logWarn(`[${context}] ${message}`, meta),
    error: (message: string, error?: any) => logError(`[${context}] ${message}`, error),
    debug: (message: string, meta?: any) => logDebug(`[${context}] ${message}`, meta),
  };
};






