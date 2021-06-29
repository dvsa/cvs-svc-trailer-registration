import { Request, Response, NextFunction } from 'express';
import * as domain from '../../domain';
import { getTrailerValidator } from '../validators/get-trailer-registration';
import { ERRORS, GetTrailerRequest } from '../../domain';
import { TrailerRegistrationBase } from './trailer-registration-base';
import { log } from '../../utils/logger';

export class GetTrailerRegistration extends TrailerRegistrationBase {
  private validate(payload: GetTrailerRequest): string {
    const errors = getTrailerValidator.validate(payload).error;
    return errors?.message;
  }

  public async call(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { vin } = req.params;
    const { make } = req.query;
    const payload: GetTrailerRequest = { vin, make: make as string };
    const errors = this.validate(payload);
    if (errors) {
      next(new domain.HTTPError(400, errors));
      return;
    }

    try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const vinOrChassisWithMake = this.defineVinOrChassisWithMake(vin, payload.make);
      const existingTrailerRegistration = await this.getTrailerRegistrationByVinOrChassisWithMake(vinOrChassisWithMake);
      if (!existingTrailerRegistration) {
        log.debug('record not found for ', payload);
        next(new domain.HTTPError(404, ERRORS.RECORD_NOT_FOUND));
        return;
      }
      if (existingTrailerRegistration.deregisterDate) {
        log.debug('deregistered record found for', payload);
        next(new domain.HTTPError(404, ERRORS.RECORD_NOT_FOUND));
        return;
      }
      delete existingTrailerRegistration.archive;
      res.status(200).send(existingTrailerRegistration);
    } catch (err) {
      log.debug('failed during get request for', payload);
      next(new domain.HTTPError(500, err));
    }
  }
}
