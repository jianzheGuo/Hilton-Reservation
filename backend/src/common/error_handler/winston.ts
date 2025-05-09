import { createLogger, format, transports } from "winston";
const winstonLogger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

export function logError(error: unknown) {
  if (error instanceof Error) {
    winstonLogger.error({
      message: error.message,
      stack: error.stack,
    });
  } else {
    winstonLogger.error("Unknown error occurred", { error });
  }
}
