import * as Joi from '@hapi/joi';
import { JoiObject } from '@hapi/joi';

export const validate = (data: any, validator: JoiObject, allowUnknown = false): void => {
  const result = Joi.validate(data, validator, { abortEarly: false, allowUnknown });

  if (result.error) {
    throw new Error(`Validation error: ${result.error.message}`);
  }
};
