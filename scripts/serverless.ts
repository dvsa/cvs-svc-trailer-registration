import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'cvs-svc-trailer-registration',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  // TODO Reduce for multiple output if we need multiple outputs, functions in handler instead of serverless.yml config however this is handled by slsw.lib.entries in webpack.config.js for us
  // Please see doc: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/serverless/plugins/aws/provider/awsProvider.d.ts and serverless.yml
  functions: {},
};

module.exports = serverlessConfiguration;
