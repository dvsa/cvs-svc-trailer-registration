import { Request, Response, NextFunction } from 'express';
import { IRequestHandler } from './i-request-handler';
import { DataAccess } from '../../utils/data-access';
import * as domain from '../../domain';
import { log } from '../../utils/logger';

export abstract class TrailerRegistrationBase implements IRequestHandler {
  dao: DataAccess;

  constructor(_dao: DataAccess) {
    this.dao = _dao;
  }

  protected defineVinOrChassisWithMake(vin: string, make: string): string {
    return vin.length === 17 ? vin : `${vin + make}`;
  }

  protected async getTrailerRegistrationByVinOrChassisWithMake(
    vinOrChassisWithMake: string,
  ): Promise<domain.TrailerRegistration | null> {
    const trailerRegistration = await this.dao.getByVinOrChassisWithMake(vinOrChassisWithMake);
    if (!trailerRegistration) {
      return null;
    }
    if (trailerRegistration.length === 1) {
      log.debug('record found on GET', trailerRegistration);
      return trailerRegistration[0];
    }

    throw new domain.HTTPError(500, domain.ERRORS.MULTIPLE_REGISTRATIONS);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public call(_req: Request, _res: Response, _next: NextFunction): Promise<void> {
    throw new Error('not implemented');
  }
}
