/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DataAccess } from '../../src/utils/data-access';
import trailerRegistrations from '../resources/trailer-registration.json';
import * as domain from '../../src/domain';
import { log } from '../../src/utils/logger';

export const populateDatabase = async () => {
  const DAO = new DataAccess();
  const result = await DAO.createMultiple((trailerRegistrations as unknown) as domain.TrailerRegistration[]);
  log.debug('populate result', result);
};

export const emptyDatabase = async () => {
  const DAO = new DataAccess();
  const registrations = (trailerRegistrations as unknown) as domain.TrailerRegistration[];
  const ids = registrations.map((reg) => reg.vinOrChassisWithMake);
  const result = await DAO.deleteMultiple(ids);
  log.debug('delete result', result);
};
