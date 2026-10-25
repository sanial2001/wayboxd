import { REVIEW_BODY_MAX_LENGTH, REVIEW_TITLE_MAX_LENGTH } from '@/app/api/model/enums/review-body';
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
        description:
          'Authenticated user profile (session required). Sign in via the app first so the browser sends the NextAuth session cookie.',
      },
      {
        name: 'Place',
        description:
          'Place search and save (session required). Sign in via the app first so the browser sends the NextAuth session cookie.',
      },
      {
        name: 'Trip',
        description:
          'Authenticated user trips (session required). Sign in via the app first so the browser sends the NextAuth session cookie.',
      },
      {
        name: 'Review',
        description:
          'Authenticated user reviews (session required). Sign in via the app first so the browser sends the NextAuth session cookie.',
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
        UserProfileModel: {
          type: 'object',
          properties: {
            userId: { type: 'integer' },
            displayName: { type: 'string', nullable: true },
            bio: { type: 'string', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
            instagramProfileUrl: { type: 'string', nullable: true },
            xProfileUrl: { type: 'string', nullable: true },
            otherProfileUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        UserAvatarUploadResult: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            pathname: { type: 'string' },
            contentType: { type: 'string', nullable: true },
          },
        },
        TripCoverUploadResult: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            pathname: { type: 'string' },
            contentType: { type: 'string', nullable: true },
          },
        },
        SaveUserProfileBodyRequest: {
          type: 'object',
          properties: {
            displayName: { type: 'string', nullable: true },
            bio: { type: 'string', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
            instagramProfileUrl: { type: 'string', nullable: true },
            xProfileUrl: { type: 'string', nullable: true },
            otherProfileUrl: { type: 'string', nullable: true },
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
        TripPlaceModel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            city: { type: 'string' },
            region: { type: 'string', nullable: true },
            country: { type: 'string' },
          },
        },
        ReviewModel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            placeId: { type: 'integer' },
            title: { type: 'string' },
            body: { type: 'string', nullable: true },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            wouldGoAgain: { type: 'boolean', nullable: true },
            visitDate: { type: 'string', format: 'date-time', nullable: true },
            tags: { type: 'array', items: { type: 'string' } },
            place: { $ref: '#/components/schemas/TripPlaceModel' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        SaveReviewBodyRequest: {
          type: 'object',
          required: ['placeId', 'title', 'rating'],
          properties: {
            placeId: { type: 'integer', minimum: 1 },
            title: { type: 'string', maxLength: REVIEW_TITLE_MAX_LENGTH },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            body: { type: 'string', nullable: true, maxLength: REVIEW_BODY_MAX_LENGTH },
            wouldGoAgain: { type: 'boolean', nullable: true },
            visitDate: { type: 'string', format: 'date-time', nullable: true },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
        TripStatus: {
          type: 'string',
          enum: ['Draft', 'Published', 'Archived', 'Deleted'],
        },
        TripModel: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            title: { type: 'string' },
            blurb: { type: 'string', nullable: true },
            coverImageUrl: { type: 'string' },
            outboundUrl: { type: 'string', nullable: true },
            tag: { type: 'string', nullable: true },
            duration: { type: 'string', nullable: true },
            tripDate: { type: 'string', format: 'date-time' },
            placeId: { type: 'integer', nullable: true },
            place: {
              nullable: true,
              allOf: [{ $ref: '#/components/schemas/TripPlaceModel' }],
            },
            status: { $ref: '#/components/schemas/TripStatus' },
            publishedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        SaveTripBodyRequest: {
          type: 'object',
          required: ['title', 'coverImageUrl', 'tripDate'],
          properties: {
            title: { type: 'string' },
            coverImageUrl: { type: 'string', format: 'uri' },
            outboundUrl: { type: 'string', format: 'uri', nullable: true },
            tripDate: { type: 'string', format: 'date-time' },
            blurb: { type: 'string', nullable: true },
            tag: { type: 'string', nullable: true },
            duration: { type: 'string', nullable: true },
            placeId: { type: 'integer', nullable: true, minimum: 1 },
          },
        },
        SaveDraftTripBodyRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            coverImageUrl: { type: 'string', format: 'uri', nullable: true },
            outboundUrl: { type: 'string', format: 'uri', nullable: true },
            tripDate: { type: 'string', format: 'date-time', nullable: true },
            blurb: { type: 'string', nullable: true },
            tag: { type: 'string', nullable: true },
            duration: { type: 'string', nullable: true },
            placeId: { type: 'integer', nullable: true, minimum: 1 },
          },
        },
        UpdateTripBodyRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            blurb: { type: 'string', nullable: true },
            coverImageUrl: { type: 'string', format: 'uri' },
            outboundUrl: { type: 'string', format: 'uri', nullable: true },
            tag: { type: 'string', nullable: true },
            duration: { type: 'string', nullable: true },
            tripDate: { type: 'string', format: 'date-time' },
            placeId: { type: 'integer', nullable: true, minimum: 1 },
            status: { $ref: '#/components/schemas/TripStatus' },
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
  apis: [
    path.join(process.cwd(), 'src/app/api/(controller)/place/**/route.docs.ts'),
    path.join(process.cwd(), 'src/app/api/(controller)/user/**/route.docs.ts'),
  ],
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
