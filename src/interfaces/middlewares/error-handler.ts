import { NextFunction, Response, Request } from 'express';
import * as domain from '../../domain';
import { log } from '../../utils/logger';

export const errorHandler = (err: domain.HTTPError, _req: Request, res: Response, next: NextFunction): void => {
  log.error(err);
  const status = err.statusCode || 500;
  const message = status === 500 ? domain.ERRORS.INTERNAL_SERVER_ERROR : err.body;
  res.status(status).send(message);
  next();
};
