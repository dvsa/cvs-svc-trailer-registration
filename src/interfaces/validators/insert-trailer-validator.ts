import Joi from 'joi';

export const insertValidator = Joi.object().keys({
  vin: Joi.string().required(),
  make: Joi.string().required(),
  trn: Joi.string().required(),
  certificateExpiryDate: Joi.date().iso().required(),
  certificateIssueDate: Joi.date().iso().required(),
}).required();
