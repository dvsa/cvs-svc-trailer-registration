import { Request, Response, NextFunction } from 'express';
import * as domain from '../../domain';
import { DataAccess } from '../../utils/data-access';
import { IRequestHandler } from './i-request-handler';
import { insertValidator } from '../validators/insert-trailer-validator';

export class InsertTrailerRegistration implements IRequestHandler {
  private dao: DataAccess;

  constructor(_dao: DataAccess) {
    this.dao = _dao;
  }

  private validate(payload?: domain.TrailerRegistration): string {
    const errors = insertValidator.validate(payload, { abortEarly: false }).error;
    return errors?.message;
  }

  public async call(req: Request, res: Response, next: NextFunction) {
    const trailerRegistration = req.body as domain.TrailerRegistration;
    const errors = this.validate(trailerRegistration);
    if (errors) {
      next(new domain.HTTPError(400, errors));
      return;
    }

    const { vin, make, certificateIssueDate } = trailerRegistration;
    const vinOrChassisWithMake = vin.length === 17 ? vin : vin + make;

    try {
      const existingTrailerRegistration = await this.getTrailerRegistrationByVinOrChassisWithMake(vinOrChassisWithMake);
      if (!existingTrailerRegistration) {
        trailerRegistration.vinOrChassisWithMake = vinOrChassisWithMake;
        const result = await this.dao.upsertTrailerRegistration(trailerRegistration);
        res.status(200).send(result);
        return;
      }
      const { archive, reasonForDeregistration, deregisterDate } = existingTrailerRegistration;
      delete existingTrailerRegistration.archive;
      delete existingTrailerRegistration.vinOrChassisWithMake;
      trailerRegistration.archive = archive || [];
      const recordToArchive = reasonForDeregistration || deregisterDate
        ? existingTrailerRegistration
        : this.deregisterTrailer(existingTrailerRegistration, certificateIssueDate);
      trailerRegistration.archive.push(recordToArchive);
      trailerRegistration.vinOrChassisWithMake = vinOrChassisWithMake;
      const result = await this.dao.upsertTrailerRegistration(trailerRegistration);
      res.status(200).send(result);
    } catch (error) {
      next(new domain.HTTPError(500, error));
    }
  }

  private async getTrailerRegistrationByVinOrChassisWithMake(
    vinOrChassisWithMake: string,
  ): Promise<domain.TrailerRegistration | null> {
    const trailerRegistration = await this.dao.getByVinOrChassisWithMake(vinOrChassisWithMake);
    if (!trailerRegistration) {
      return null;
    }
    if (trailerRegistration.length === 1) {
      return trailerRegistration[0];
    }

    throw new domain.HTTPError(500, domain.ERRORS.MULTIPLE_REGISTRATIONS);
  }

  private deregisterTrailer(trailerRegistration: domain.TrailerRegistration, deregisterDate: Date) {
    return ({
      ...trailerRegistration,
      reasonForDeregistration: domain.MESSAGES.NEW_CERTIFICATE_RECEIVED,
      deregisterDate,
    } as unknown) as domain.TrailerRegistration;
  }
}
