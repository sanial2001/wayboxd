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
        name: 'Place',
        description:
          'Place search and save (session required). Sign in via the app first so the browser sends the NextAuth session cookie.',
      },
    ],
    components: {
      securitySchemes: {
        sessionCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'next-auth.session-token',
          description:
            'NextAuth session cookie from an app sign-in. Swagger UI sends cookies when Try it out is used.',
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
        PlaceCategory: {
          type: 'string',
          enum: ['Destination', 'Area', 'Cafe', 'Restaurant', 'Bar', 'Park', 'Museum', 'Other'],
        },
        PlaceExternalSource: {
          type: 'string',
          enum: ['osm', 'manual'],
        },
        PlaceModel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            slug: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            category: { $ref: '#/components/schemas/PlaceCategory' },
            parentPlaceId: { type: 'integer', nullable: true },
            externalSource: {
              allOf: [{ $ref: '#/components/schemas/PlaceExternalSource' }],
              nullable: true,
            },
            externalId: { type: 'string', nullable: true },
            city: { type: 'string' },
            region: { type: 'string', nullable: true },
            country: { type: 'string' },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            address: { type: 'string', nullable: true },
            coverImageUrl: { type: 'string', nullable: true },
            createdByUserId: { type: 'integer', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        OsmPlaceSearchHit: {
          type: 'object',
          properties: {
            source: { type: 'string', enum: ['osm'] },
            externalId: { type: 'string' },
            osmType: { type: 'string' },
            osmKey: { type: 'string' },
            osmValue: { type: 'string' },
            name: { type: 'string' },
            category: { $ref: '#/components/schemas/PlaceCategory' },
            city: { type: 'string' },
            region: { type: 'string', nullable: true },
            country: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            address: { type: 'string', nullable: true },
          },
        },
        PlaceSearchResult: {
          type: 'object',
          properties: {
            local: {
              type: 'array',
              items: { $ref: '#/components/schemas/PlaceModel' },
            },
            osm: {
              type: 'array',
              items: { $ref: '#/components/schemas/OsmPlaceSearchHit' },
            },
          },
        },
        SavePlaceFromOsmRequest: {
          type: 'object',
          required: [
            'externalId',
            'osmType',
            'osmKey',
            'osmValue',
            'name',
            'category',
            'city',
            'country',
            'latitude',
            'longitude',
          ],
          properties: {
            externalId: { type: 'string' },
            osmType: { type: 'string' },
            osmKey: { type: 'string' },
            osmValue: { type: 'string' },
            name: { type: 'string' },
            category: { $ref: '#/components/schemas/PlaceCategory' },
            city: { type: 'string' },
            country: { type: 'string' },
            region: { type: 'string', nullable: true },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            address: { type: 'string', nullable: true },
          },
        },
        SaveManualPlaceRequest: {
          type: 'object',
          required: ['name', 'category', 'city', 'country'],
          properties: {
            name: { type: 'string' },
            category: { $ref: '#/components/schemas/PlaceCategory' },
            city: { type: 'string' },
            country: { type: 'string' },
            region: { type: 'string', nullable: true },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            address: { type: 'string', nullable: true },
          },
        },
        ManualPlaceSaveResult: {
          oneOf: [
            {
              type: 'object',
              required: ['status', 'place'],
              properties: {
                status: { type: 'string', enum: ['created'] },
                place: { $ref: '#/components/schemas/PlaceModel' },
              },
            },
            {
              type: 'object',
              required: ['status', 'candidates'],
              properties: {
                status: { type: 'string', enum: ['duplicate'] },
                candidates: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/PlaceModel' },
                },
              },
            },
          ],
        },
      },
    },
  },
  apis: [path.join(process.cwd(), 'src/app/api/(controller)/place/**/route.docs.ts')],
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
