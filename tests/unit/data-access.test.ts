import { DataAccess } from '../../src/utils/data-access';
import { TrailerRegistration } from '../../src/domain/trailer-registration';

let mockDAO: DataAccess;
describe('DataAccess', () => {
  beforeEach(() => {
    mockDAO = new DataAccess();
  });

  afterEach(() => {
    jest.resetAllMocks().restoreAllMocks();
  });

  describe('getByVinOrChassisWithMake', () => {
    test('should return record for the provided vinOrChassisWithMake', async () => {
      const data = [
        {
          vinOrChassisWithMake: 'ABC1321234566big truck',
          vin: 'ABC1321234566',
          make: 'big truck',
          trn: 'AB123AD',
          certificateExpiryDate: '2021-12-12',
          certificateIssueDate: '2021-01-01',
        },
      ];

      const daoStub = jest.fn().mockImplementation(() => Promise.resolve({ Count: 1, Items: data }));

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mockDAO.getById = daoStub;

      const result = await mockDAO.getByVinOrChassisWithMake('ABC1321234566big truck');
      expect(result).toEqual(data);
    });

    test('return null if no record is found for the provided vinOrChassisWithMake', async () => {
      const daoStub = jest.fn().mockImplementation(() => Promise.resolve({ Count: 0, Items: null }));

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mockDAO.getById = daoStub;

      const result = await mockDAO.getByVinOrChassisWithMake('AB123ADbigtruck');
      expect(result).toEqual(null);
    });
  });
});

describe('getByTrn', () => {
  test('should return record for the provided trn', async () => {
    const data = [
      {
        vinOrChassisWithMake: 'ABC1321234566big truck',
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      },
    ];

    const daoStub = jest.fn().mockImplementation(() => Promise.resolve({ Count: 1, Items: data }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockDAO.getById = daoStub;

    const result = await mockDAO.getByTrn('AB123AD');

    expect(result).toEqual(data);
  });

  test('return null if no record is found for the provided trn', async () => {
    const daoStub = jest.fn().mockImplementation(() => Promise.resolve({ Count: 0, Items: null }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockDAO.getById = daoStub;

    const result = await mockDAO.getByTrn('AB123AD');
    expect(result).toEqual(null);
  });
});
describe('upsertTrailerRegistration', () => {
  test('should successfully insert a valid record', () => {
    const data = ({
      vinOrChassisWithMake: 'ABC1321234566big truck',
      vin: 'ABC1321234566',
      make: 'big truck',
      trn: 'AB123AD',
      certificateExpiryDate: '2021-12-12',
      certificateIssueDate: '2021-01-01',
    } as unknown) as TrailerRegistration;

    const daoPutStub = jest.fn().mockImplementation(() => Promise.resolve());
    const daoGetStub = jest.fn().mockImplementation(() => Promise.resolve([{
      vinOrChassisWithMake: 'ABC1321234566big truck',
      vin: 'ABC1321234566',
      make: 'big truck',
      trn: 'AB123AD',
      certificateExpiryDate: '2021-12-12',
      certificateIssueDate: '2021-01-01',
    }]));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockDAO.put = daoPutStub;
    mockDAO.getByVinOrChassisWithMake = daoGetStub;

    return mockDAO.upsertTrailerRegistration(data).then((result) => {
      expect(result).toEqual(data);
    });
  });
});

describe('createMultiple', () => {
  test('should successfully insert a valid record', () => {
    const data = ([{
      vinOrChassisWithMake: 'ABC1321234566big truck',
      vin: 'ABC1321234566',
      make: 'big truck',
      trn: 'AB123AD',
      certificateExpiryDate: '2021-12-12',
      certificateIssueDate: '2021-01-01',
    }] as unknown) as TrailerRegistration[];

    const batchWrite = jest.fn().mockImplementation(() => Promise.resolve({}));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockDAO.batchWrite = batchWrite;

    return mockDAO.createMultiple(data).then((result) => {
      expect(result).toEqual({});
    });
  });
});

describe('deleteMultiple', () => {
  test('should successfully insert a valid record', () => {
    const data = ['ABC1321234566big truck'];

    const batchWrite = jest.fn().mockImplementation(() => Promise.resolve({}));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockDAO.batchWrite = batchWrite;

    return mockDAO.deleteMultiple(data).then((result) => {
      expect(result).toEqual({});
    });
  });
});
