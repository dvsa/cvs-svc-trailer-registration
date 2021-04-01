import { Request, Response, NextFunction } from 'express';
import * as domain from '../../domain';
import { DataAccess } from '../../utils/data-access';
import { warn } from '../../utils/logger';
import { IRequestHandler } from './i-request-handler';
import { deregisterTrailerValidator } from '../validators/deregister-trailer-validator';

export class DeregisterTrailer implements IRequestHandler {
  private dao: DataAccess;

  constructor(_dao: DataAccess) {
    this.dao = _dao;
  }

  private validate(payload?: domain.DeregisterTrailer): string {
    const errors = deregisterTrailerValidator.validate(payload, { abortEarly: false }).error;
    return errors?.message;
  }

  public async call(req: Request, res: Response, next: NextFunction): Promise<void> {
    const deregisterTrailer = req.body as domain.DeregisterTrailer;
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
        warn(`record not found for ${trn}`);
        res.status(204).send();
        return;
      }
      existingTrailerRegistration = {
        ...existingTrailerRegistration,
        reasonForDeregistration,
        deregisterDate,
      };
      const result = await this.dao.upsertTrailerRegistration(existingTrailerRegistration);
      res.status(200).send(result);
    } catch (error) {
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
