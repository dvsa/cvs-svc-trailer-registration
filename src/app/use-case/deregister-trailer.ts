import { TrailerRegistration } from '../../domain';

export const deregisterTrailer = (
  trailerRegistration: TrailerRegistration,
  deregisterDate: Date,
  reasonForDeregistration: string,
): TrailerRegistration => (({
  ...trailerRegistration,
  reasonForDeregistration,
  deregisterDate,
} as unknown) as TrailerRegistration);
