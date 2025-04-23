import { mockClient } from 'aws-sdk-client-mock';
import {
  BatchWriteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { DataAccess } from '../../src/utils/data-access';
import { TrailerRegistration } from '../../src/domain/trailer-registration';

describe('DataAccess', () => {
  beforeEach(() => {
    jest.resetModules();
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

      const mockDAO = new DataAccess();
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(QueryCommand).resolves({ Count: 1, Items: data });

      const result = await mockDAO.getByVinOrChassisWithMake('ABC1321234566big truck');
      expect(result).toEqual(data);
    });

    test('return null if no record is found for the provided vinOrChassisWithMake', async () => {
      const mockDAO = new DataAccess();
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(QueryCommand).resolves({ Count: 0, Items: null });

      const result = await mockDAO.getByVinOrChassisWithMake('AB123ADbigtruck');
      expect(result).toBeNull();
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

    const mockDAO = new DataAccess();
    const mockDynamoClient = mockClient(DynamoDBDocumentClient);
    mockDynamoClient.on(QueryCommand).resolves({ Count: 1, Items: data });

    const result = await mockDAO.getByTrn('AB123AD');

    expect(result).toEqual(data);
  });

  test('return null if no record is found for the provided trn', async () => {
    const mockDAO = new DataAccess();
    const mockDynamoClient = mockClient(DynamoDBDocumentClient);
    mockDynamoClient.on(QueryCommand).resolves({ Count: 0, Items: null });

    const result = await mockDAO.getByTrn('AB123AD');
    expect(result).toBeNull();
  });
});
describe('upsertTrailerRegistration', () => {
  test('should successfully insert a valid record', () => {
    const data = {
      vinOrChassisWithMake: 'ABC1321234566big truck',
      vin: 'ABC1321234566',
      make: 'big truck',
      trn: 'AB123AD',
      certificateExpiryDate: '2021-12-12',
      certificateIssueDate: '2021-01-01',
    } as unknown as TrailerRegistration;

    const mockDAO = new DataAccess();
    const mockDynamoClient = mockClient(DynamoDBDocumentClient);
    mockDynamoClient.on(QueryCommand).resolves({
      Count: 1,
      Items: [
        {
          vinOrChassisWithMake: 'ABC1321234566big truck',
          vin: 'ABC1321234566',
          make: 'big truck',
          trn: 'AB123AD',
          certificateExpiryDate: '2021-12-12',
          certificateIssueDate: '2021-01-01',
        },
      ],
    });
    mockDynamoClient.on(PutCommand).resolves({});

    return mockDAO.upsertTrailerRegistration(data).then((result) => {
      expect(result).toEqual(data);
    });
  });
});

describe('createMultiple', () => {
  test('should successfully insert a valid record', () => {
    const data = [
      {
        vinOrChassisWithMake: 'ABC1321234566big truck',
        vin: 'ABC1321234566',
        make: 'big truck',
        trn: 'AB123AD',
        certificateExpiryDate: '2021-12-12',
        certificateIssueDate: '2021-01-01',
      },
    ] as unknown as TrailerRegistration[];

    const mockDAO = new DataAccess();
    const mockDynamoClient = mockClient(DynamoDBDocumentClient);
    mockDynamoClient.on(BatchWriteCommand).resolves({});

    return mockDAO.createMultiple(data).then((result) => {
      expect(result).toEqual({});
    });
  });
});

describe('deleteMultiple', () => {
  test('should successfully insert a valid record', () => {
    const data = ['ABC1321234566big truck'];

    const mockDAO = new DataAccess();
    const mockDynamoClient = mockClient(DynamoDBDocumentClient);
    mockDynamoClient.on(BatchWriteCommand).resolves({});

    return mockDAO.deleteMultiple(data).then((result) => {
      expect(result).toEqual({});
    });
  });
});
