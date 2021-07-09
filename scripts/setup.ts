/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/await-thenable */
import { spawn } from 'child_process';

// We hook to serverless offline when firing its process
const SERVER_OK = 'server ready: http://localhost:3020';
// Serverless fires a local dynamo-db instance which is killed once the parent process is terminated
// the current serverless script checks whether a local instance is running but does not error when binding fails
// we force throwing an error so we always start from a clean slate if java.io.IOException: Failed to bind to 0.0.0.0/0.0.0.0:8006
const DYNAMO_LOCAL_ERROR_THREAD = 'Exception in thread "main"';

const setupServer = (process) => new Promise((resolve, reject) => {
  process.stdout.setEncoding('utf-8').on('data', (stream) => {
    // last message emitted by webpack once the server is up and running
    if (stream.includes(SERVER_OK)) {
      resolve(process);
    }
  });

  process.stderr.setEncoding('utf-8').on('data', (stream) => {
    console.log(stream);
    if (stream.includes(DYNAMO_LOCAL_ERROR_THREAD)) {
      throw new Error('Internal Java process crashed');
    }
    reject(stream);
  });

  process.on('error', (err) => {
    console.log('\nSomething wrong happened :(\n\n');
    console.error(`err: ${err}`);
    reject(err);
  });

  process.on('exit', (code, signal) => {
    console.info(`process terminated with code: ${code} and signal: ${signal}`);
  });
});

const server = spawn('npm', ['run', 'start']);

module.exports = async () => {
  console.log('\nSetting up Integration tests...\n\n');
  try {
    await setupServer(server);
  } catch (e) {
    console.error('Something wrong happened:\n');
    console.error(e);
    process.exit(1);
  }
};
