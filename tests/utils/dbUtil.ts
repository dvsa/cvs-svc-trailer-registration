/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DataAccess } from '../../src/utils/data-access';
import trailerRegistrations from '../../data/trailer-registration.json';
import * as domain from '../../src/domain';

export const populateDatabase = async () => {
  const DAO = new DataAccess();
  await DAO.createMultiple((trailerRegistrations as unknown) as domain.TrailerRegistration[]);
};

export const emptyDatabase = async () => {
  const DAO = new DataAccess();
  const registrations = (trailerRegistrations as unknown) as domain.TrailerRegistration[];
  const ids = registrations.map((reg) => reg.vinOrChassisWithMake);
  await DAO.deleteMultiple(ids);
};
