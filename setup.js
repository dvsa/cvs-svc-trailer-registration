const { spawn } = require('child_process');

const setupServer = (process) => {
  return new Promise((resolve, reject) => {
    process.stdout.setEncoding('utf-8').on('data', (stream) => {
      // last message emitted by webpack once the server is up and running
      if (stream.includes('No issues found')) {
        console.log('Server is now running...');
        resolve({ ok: stream });
      }
    });

    process.on('error', (err) => {
      console.log(`\nSomething wrong happened :(\n\n`);
      console.error(`err: ${err}`);
      reject(err);
    });
  });
};

const server = spawn('npm', ['run', 'start']);

module.exports = async () => {
  try {
    console.log('\nstarting server...');
    global.__SERVER__ = server;
    await setupServer(server);
  } catch (e) {
    console.log('Integration tests running failed!');
    console.error(e);
  }
};
