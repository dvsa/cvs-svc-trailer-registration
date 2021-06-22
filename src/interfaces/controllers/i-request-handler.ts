import { Request, Response, NextFunction } from 'express';

export interface IRequestHandler {
  call(req: Request, res: Response, next: NextFunction);
}
