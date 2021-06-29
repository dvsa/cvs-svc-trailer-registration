/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Request, Response, NextFunction } from 'express';
import * as domain from '../../domain';
import { log } from '../../utils/logger';
import { deregisterTrailerValidator } from '../validators/deregister-trailer-validator';
import { TrailerRegistrationBase } from './trailer-registration-base';
import * as usecase from '../../app';

export class DeregisterTrailer extends TrailerRegistrationBase {
  private validate(payload?: domain.DeregisterTrailerRequest): string {
    const errors = deregisterTrailerValidator.validate(payload, { abortEarly: false }).error;
    return errors?.message;
  }

  public async call(req: Request, res: Response, next: NextFunction): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const deregisterTrailer = req.body as domain.DeregisterTrailerRequest;
    const { trn } = req.params;

    const errors = this.validate(deregisterTrailer);
    if (errors) {
      next(new domain.HTTPError(400, errors));
      return;
    }

    try {
      const { reasonForDeregistration, deregisterDate } = deregisterTrailer;
      let existingTrailerRegistration = await this.getExistingTrailerRegistrationByTrn(trn);
      if (!existingTrailerRegistration) {
        log.warn(`record not found for ${trn}`);
        res.status(204).send();
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      existingTrailerRegistration = usecase.deregisterTrailer(
        existingTrailerRegistration,
        deregisterDate,
        reasonForDeregistration,
      );

      const result = await this.dao.upsertTrailerRegistration(existingTrailerRegistration);
      res.status(200).send(result);
    } catch (error) {
      log.debug('deregister failed for', req.body);
      next(new domain.HTTPError(500, error));
    }
  }

  private async getExistingTrailerRegistrationByTrn(trn: string): Promise<domain.TrailerRegistration | null> {
    const trailerRegistration = await this.dao.getByTrn(trn);
    if (!trailerRegistration) {
      return null;
    }

    if (trailerRegistration.length === 1) {
      return trailerRegistration[0];
    }
    throw new domain.HTTPError(500, `${domain.ERRORS.MULTIPLE_REGISTRATIONS} for trn${trn}`);
  }
}
