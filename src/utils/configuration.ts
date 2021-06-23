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
      endpoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:8020',
      convertEmptyValues: process.env.CONVERT_EMPTY_VALUES || true,
    };
    if (this.branch !== 'local') {
      delete dbParams.endpoint;
      delete dbParams.region;
    }
    return dbParams;
  }

  get GlobalLogLevel(): string {
    return process.env.LOG_LEVEL || 'WARN';
  }
}
