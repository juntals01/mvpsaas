import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  API_PORT: Joi.number().port().default(8000),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  WEB_URL: Joi.string().required(),
  CLERK_ISSUER_URL: Joi.string().uri().optional(),

  POSTGRES_HOST: Joi.string().default('127.0.0.1'),
  POSTGRES_PORT: Joi.number().default(5433),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
});
