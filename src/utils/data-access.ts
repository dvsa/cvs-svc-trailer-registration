import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  QueryCommand,
  DynamoDBDocumentClient,
  QueryCommandOutput,
  PutCommandOutput,
  PutCommand,
  BatchWriteCommand,
  BatchWriteCommandOutput,
  BatchWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { ServiceException } from '@smithy/smithy-client';
import * as domain from '../domain';
import { Configurations } from './configuration';
import { log } from './logger';

export class DataAccess {
  // private static instance: DataAccess;

  private readonly tableName: string = Configurations.getInstance().dynamoTableName;

  private docClient: DynamoDBDocumentClient;

  public constructor() {
    this.docClient = DynamoDBDocumentClient.from(new DynamoDBClient(Configurations.getInstance().dynamoParams));
  }

  private async getById(options: {
    indexName: string;
    keyCondition: string;
    expressionAttributeValues: { [key: string]: string };
  }): Promise<QueryCommandOutput | ServiceException> {
    const params = {
      TableName: this.tableName,
      IndexName: options.indexName,
      KeyConditionExpression: options.keyCondition,
      ExpressionAttributeValues: options.expressionAttributeValues,
    };
    log.debug('params getbyId', params);
    const command = new QueryCommand(params);
    return this.docClient.send(command);
  }

  private async put<T>(
    payload: T,
    options?: { conditionalExpression: string; expressionAttributeValues: { [key: string]: string } },
  ): Promise<PutCommandOutput | ServiceException> {
    let query = {
      TableName: this.tableName,
      Item: payload,
      ConditionExpression: undefined,
      ExpressionAttributeValues: undefined,
    };
    if (options) {
      query = {
        ...query,
        ConditionExpression: options.conditionalExpression,
        ExpressionAttributeValues: options.expressionAttributeValues,
      };
    }
    const command = new PutCommand(query);
    return this.docClient.send(command);
  }

  public async upsertTrailerRegistration(
    trailerRegistration: domain.TrailerRegistration,
  ): Promise<domain.TrailerRegistration> {
    await this.put<domain.TrailerRegistration>(trailerRegistration);
    return trailerRegistration;
  }

  public async getByVinOrChassisWithMake(vinOrChassisWithMake: string): Promise<domain.TrailerRegistration[]> {
    const getParams = {
      indexName: 'vinOrChassisWithMakeIndex',
      keyCondition: 'vinOrChassisWithMake = :vinOrChassisWithMake',
      expressionAttributeValues: {
        ':vinOrChassisWithMake': vinOrChassisWithMake,
      },
    };
    const data = (await this.getById(getParams)) as { Count: number; Items: unknown };
    if (!data || !data.Count) {
      log.debug('record not found for', vinOrChassisWithMake);
      return null;
    }
    return data.Items as domain.TrailerRegistration[];
  }

  public async getByTrn(trn: string): Promise<domain.TrailerRegistration[]> {
    const getParams = {
      indexName: 'trnIndex',
      keyCondition: 'trn = :trn',
      expressionAttributeValues: {
        ':trn': trn,
      },
    };
    const data = (await this.getById(getParams)) as { Count: number; Items: unknown };
    if (!data || !data.Count) {
      return null;
    }
    return data.Items as domain.TrailerRegistration[];
  }

  public async createMultiple(
    trailerRegistrations: domain.TrailerRegistration[],
  ): Promise<BatchWriteCommandOutput | ServiceException> {
    const params = this.generateBatchWritePartialParams();

    params.RequestItems[this.tableName].push(
      ...trailerRegistrations.map((trailerRegistration) => ({
        PutRequest: {
          Item: trailerRegistration,
        },
      })),
    );
    return this.batchWrite(params);
  }

  public async deleteMultiple(vinOrChassisWithMakeIds: string[]): Promise<BatchWriteCommandOutput | ServiceException> {
    const params = this.generateBatchWritePartialParams();

    params.RequestItems[this.tableName].push(
      ...vinOrChassisWithMakeIds.map((id) => ({
        DeleteRequest: {
          Key: {
            vinOrChassisWithMake: id,
          },
        },
      })),
    );

    return this.batchWrite(params);
  }

  public async batchWrite(params: BatchWriteCommandInput): Promise<ServiceException | BatchWriteCommandOutput> {
    const command = new BatchWriteCommand(params);
    return this.docClient.send(command);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public generateBatchWritePartialParams(): BatchWriteCommandInput {
    return {
      RequestItems: {
        [this.tableName]: [],
      },
    };
  }
}
