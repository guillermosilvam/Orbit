import pinoHttp from "pino-http";
import { logger } from "../logger.ts";

export const requestLogger = pinoHttp({
  logger,

  customSuccessMessage: (req, res, responseTime) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;
  },

  customErrorMessage: (req, res, _err) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
});