import { TrailerRegistration, MESSAGES } from '../../domain';
import { debug } from '../../utils/logger';
import { deregisterTrailer } from './deregister-trailer';

export const archiveTrailer = (
  newTrailerRegistration: TrailerRegistration,
  existingTrailerRegistration: TrailerRegistration,
): TrailerRegistration => {
  const { certificateIssueDate } = newTrailerRegistration;
  const {
    archive, reasonForDeregistration, deregisterDate, vinOrChassisWithMake,
  } = existingTrailerRegistration;
  delete existingTrailerRegistration.archive;
  delete existingTrailerRegistration.vinOrChassisWithMake;
  newTrailerRegistration.archive = archive || [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const recordToArchive = reasonForDeregistration || deregisterDate
    ? existingTrailerRegistration
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    : deregisterTrailer(existingTrailerRegistration, certificateIssueDate, MESSAGES.NEW_CERTIFICATE_RECEIVED);
  newTrailerRegistration.archive.push(recordToArchive);
  newTrailerRegistration.vinOrChassisWithMake = vinOrChassisWithMake;
  debug('newTrailerRegsitration with archive', newTrailerRegistration);
  return newTrailerRegistration;
};
