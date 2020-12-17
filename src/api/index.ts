import express from 'express';

const app = express();

// Declare middlewares
/**
 * bodyParser, error handling, logger, etc..
 * http://expressjs.com/en/starter/basic-routing.html
 * http://expressjs.com/en/guide/using-middleware.html
 */

/**
 * app level middlewares
 * app.use('/path', (req, res, next) => {
 * chain middlewares
 * next()
 * })
 */

/**
 * Define routing and route level middleware if necessary from ./routes
 */
app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.post('/', (_, res) => {
  res.send('posted!');
});

export { app };
