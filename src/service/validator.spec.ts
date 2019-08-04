import * as Joi from '@hapi/joi';
import { validate } from './validator';

describe('Validator', () => {
  it('Validates proper schema', () => {
    expect(() => {
      validate(
        { foo: 'bar' },
        Joi.object().keys({
          foo: Joi.string().required(),
        })
      );
    }).not.toThrowError();
  });

  it("Doesn't accept extra fields by default", () => {
    expect(() => {
      validate(
        { foo: 'bar', unexpected: 'data' },
        Joi.object().keys({
          foo: Joi.string().required(),
        })
      );
    }).toThrowError();
  });

  it('Accepts extra fields', () => {
    expect(() => {
      validate(
        { foo: 'bar', unexpected: 'data' },
        Joi.object().keys({
          foo: Joi.string().required(),
        }),
        true
      );
    }).not.toThrow();
  });

  it('Validates improper data', () => {
    expect(() => {
      validate(
        {},
        Joi.object().keys({
          foo: Joi.string().required(),
        })
      );
    }).toThrowError();
  });
});
