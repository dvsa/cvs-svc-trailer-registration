/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-import-module-exports
import { spawn } from 'child_process';

// We hook to serverless offline when firing its process
const SERVER_OK = 'localhost:3020';
// Serverless fires a local dynamo-db instance which is killed once the parent process is terminated
// the current serverless script checks whether a local instance is running but does not error when binding fails
// we force throwing an error so we always start from a clean slate if java.io.IOException: Failed to bind to 0.0.0.0/0.0.0.0:8006
const DYNAMO_LOCAL_ERROR_THREAD = 'Exception in thread "main"';

const setupServer = () => new Promise<void>((resolve, reject) => {
  const server = spawn('npm', ['run', 'start']);
  server.stdout.setEncoding('utf-8').on('data', (stream: string[]) => {
    if (stream.includes(SERVER_OK)) {
      // For some reason we have to ts-ignore here, even though Promise is typed as void
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resolve();
    }
  });

  server.stderr.setEncoding('utf-8').on('data', (stream: string[]) => {
    console.log(stream);
    if (stream.includes(DYNAMO_LOCAL_ERROR_THREAD)) {
      reject();
      throw new Error('Internal Java process crashed');
    }
  });
});

module.exports = async (): Promise<void> => {
  console.log('\nSetting up Integration tests...\n\n');
  try {
    await setupServer();
  } catch (e) {
    console.error('Something wrong happened: \n');
    console.error(e);
    process.exit(1);
  }
};
