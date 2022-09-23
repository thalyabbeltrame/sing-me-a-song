import { NextFunction, Request, Response } from 'express';

import {
  AppError,
  errorTypeToStatusCode,
  isAppError,
} from '../utils/errorUtils';

export function errorHandlerMiddleware(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (isAppError(err)) {
    return res
      .status(errorTypeToStatusCode(err.type))
      .send({ type: err.type, message: err.message });
  }

  return res.status(500).send({ type: 'internal', message: err.message });
}
