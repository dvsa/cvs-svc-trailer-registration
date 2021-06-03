import { Request, Response, NextFunction } from 'express';
import * as domain from '../../domain';
import { insertValidator } from '../validators/insert-trailer-validator';
import { TrailerRegistrationBase } from './trailer-registration-base';
import * as usecase from '../../app';
import { debug } from '../../utils/logger';

export class InsertTrailerRegistration extends TrailerRegistrationBase {
  private validate(payload?: domain.TrailerRegistration): string {
    const errors = insertValidator.validate(payload, { abortEarly: false }).error;
    return errors?.message;
  }

  public async call(req: Request, res: Response, next: NextFunction): Promise<void> {
    const trailerRegistration = req.body as domain.TrailerRegistration;
    const errors = this.validate(trailerRegistration);
    if (errors) {
      next(new domain.HTTPError(400, errors));
      return;
    }

    const { vin, make } = trailerRegistration;
    const vinOrChassisWithMake = this.defineVinOrChassisWithMake(vin, make);

    try {
      const existingTrailerRegistration = await this.getTrailerRegistrationByVinOrChassisWithMake(vinOrChassisWithMake);
      if (!existingTrailerRegistration) {
        debug('existing registration not found for ', vinOrChassisWithMake);
        trailerRegistration.vinOrChassisWithMake = vinOrChassisWithMake;
        const result = await this.dao.upsertTrailerRegistration(trailerRegistration);
        res.status(200).send(result);
        return;
      }
      debug('existing registration found for ', vinOrChassisWithMake);
      const newTrailerRegistration = usecase.archiveTrailer(trailerRegistration, existingTrailerRegistration);
      const result = await this.dao.upsertTrailerRegistration(newTrailerRegistration);
      res.status(200).send(result);
    } catch (err) {
      debug('insert failed for', trailerRegistration.vinOrChassisWithMake);
      next(new domain.HTTPError(500, err));
    }
  }
}
