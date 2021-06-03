import { Request, Response, NextFunction } from 'express';
import { DataAccess } from '../../utils/data-access';

export interface IRequestHandler {
  dao: DataAccess;
  call(req: Request, res: Response, next: NextFunction);
}
