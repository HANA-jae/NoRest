import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import appConfig from './app.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import jwtConfig from './jwt.config';
import corsConfig from './cors.config';
import swaggerConfig from './swagger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, jwtConfig, corsConfig, swaggerConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        APP_PORT: Joi.number().default(3000),
        APP_NAME: Joi.string().default('HAN'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().allow('').default(''),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        ACCESS_TOKEN_TTL: Joi.string().default('15m'),
        REFRESH_TOKEN_TTL: Joi.string().default('7d'),
        CORS_ORIGIN: Joi.string().default('http://localhost:5173'),
        SWAGGER_TITLE: Joi.string().default('HAN API'),
        SWAGGER_DESCRIPTION: Joi.string().default('HAN Web Service API Documentation'),
        SWAGGER_VERSION: Joi.string().default('1.0'),
        SWAGGER_PATH: Joi.string().default('api/docs'),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
})
export class AppConfigModule {}
