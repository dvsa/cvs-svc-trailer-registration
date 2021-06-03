import Joi from 'joi';

export const getTrailerValidator = Joi.object()
  .keys({
    vin: Joi.string().required(),
    make: Joi.string().required(),
  })
  .required();
