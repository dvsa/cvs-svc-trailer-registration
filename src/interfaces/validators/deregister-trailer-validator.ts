import Joi from 'joi';

export const deregisterTrailerValidator = Joi.object()
  .keys({
    deregisterDate: Joi.date().iso().required(),
    reasonForDeregistration: Joi.string().required(),
  })
  .required();
