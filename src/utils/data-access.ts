/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import DynamoDB, { DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';
import * as domain from '../domain';
import { Configurations } from './configuration';
import { log } from './logger';

export class DataAccess {
  // private static instance: DataAccess;

  private readonly tableName: string = Configurations.getInstance().dynamoTableName;

  private docClient: DocumentClient;

  public constructor() {
    this.docClient = new DynamoDB.DocumentClient(Configurations.getInstance().dynamoParams);
  }

  private getById(options: {
    indexName: string;
    keyCondition: string;
    expressionAttributeValues: { [key: string]: string };
  }): Promise<PromiseResult<QueryOutput, AWSError>> {
    const params = {
      TableName: this.tableName,
      IndexName: options.indexName,
      KeyConditionExpression: options.keyCondition,
      ExpressionAttributeValues: options.expressionAttributeValues,
    };
    log.debug('params getbyId', params);
    return this.docClient.query(params).promise();
  }

  private async put<T>(
    payload: T,
    options?: { conditionalExpression: string; expressionAttributeValues: { [key: string]: string } },
  ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
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
    return this.docClient.put(query).promise();
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
  ): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>> {
    const params = this.generateBatchWritePartialParams();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    params.RequestItems[this.tableName].push(
      ...trailerRegistrations.map((trailerRegistration) => ({
        PutRequest: {
          Item: trailerRegistration,
        },
      })),
    );

    return this.batchWrite(params);
  }

  public async deleteMultiple(
    vinOrChassisWithMakeIds: string[],
  ): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>> {
    const params = this.generateBatchWritePartialParams();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

  public batchWrite(params): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.docClient.batchWrite(params).promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public generateBatchWritePartialParams(): any {
    return {
      RequestItems: {
        [this.tableName]: [],
      },
    };
  }
}
