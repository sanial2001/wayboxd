import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wayboxd API',
      version: '1.0.0',
      description: 'API documentation for the Wayboxd application',
      contact: {
        name: 'Wayboxd Support',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Same-origin server',
      },
    ],
    tags: [
      {
        name: 'User',
        description: 'Public user signup and sign-in.',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UserModel: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            email: {
              type: 'string',
              nullable: true,
            },
            username: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
            errorCode: {
              type: 'string',
            },
            status: {
              type: 'integer',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(process.cwd(), 'src/app/api/**/*.docs.ts')],
};

export function getSwaggerSpec() {
  const srcPath = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcPath)) {
    return {
      ...options.definition,
      paths: {},
      message: 'Source files not found. Swagger docs are only available in development.',
    };
  }

  return swaggerJsdoc(options);
}
