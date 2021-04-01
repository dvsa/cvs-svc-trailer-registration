/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { DataAccess } from '../../utils/data-access';
import * as controller from '../controllers';

export const router = Router();

router.post('/', (req, res, next) => new controller.InsertTrailerRegistration(new DataAccess()).call(req, res, next));

router.put('/deregister/:trn', (req, res, next) => new controller.DeregisterTrailer(new DataAccess()).call(req, res, next));
