import * as dotenv from 'dotenv';

export class Configurations {
  private static instance: Configurations;

  private constructor() {
    dotenv.config();
  }

  public static getInstance(): Configurations {
    if (!Configurations.instance) {
      Configurations.instance = new Configurations();
    }

    return Configurations.instance;
  }

  get branch(): string {
    return process.env.BRANCH || 'local';
  }

  get awsRegion(): string {
    return process.env.AWS_PROVIDER_REGION || 'local';
  }

  get dynamoTableName(): string {
    return `cvs-${this.branch}-trailer-registration`;
  }

  get dynamoParams(): unknown {
    const dbParams = {
      region: this.awsRegion,
      endpoint: process.env.DYNAMO_ENDPOINT || 'http://127.0.1:8020',
      convertEmptyValues: true,
      credentials: {
        accessKeyId: 'foo',
        secretAccessKey: 'bar',
      },
    };
    if (this.branch !== 'local') {
      delete dbParams.endpoint;
      delete dbParams.region;
      delete dbParams.credentials;
    }
    return dbParams;
  }

  get globalLogLevel(): string {
    if (this.branch === 'local') {
      return 'DEBUG';
    }
    return process.env.LOG_LEVEL || 'DEBUG';
  }
}
