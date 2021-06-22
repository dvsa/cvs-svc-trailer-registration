import express from 'express';
import { router } from '../../interfaces/routes';
import { Configurations } from '../../utils/configuration';
import { errorHandler } from '../../interfaces/middlewares';

// initialize configurations;
Configurations.getInstance();

const app = express();

app.use(express.json());

app.use('/*/trailers/', router);

app.use(errorHandler);

export { app };
