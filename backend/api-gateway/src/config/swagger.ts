import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Prims Trade API',
    version: '1.0.0',
    description: 'Production-ready microservices backend - Auth, User, Trade Signal APIs',
  },
  servers: [{ url: '/api/v1', description: 'API v1' }],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' },
                  role: { type: 'string', enum: ['user', 'admin'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' }, 409: { description: 'Email already registered' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: { email: { type: 'string' }, password: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'OK' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' } },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update current user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' } },
              },
            },
          },
        },
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/trade-signals/public': {
      get: {
        tags: ['Trade Signals'],
        summary: 'List approved trade signals (public, no auth)',
        responses: { 200: { description: 'OK' } },
      },
    },
    '/trade-signals': {
      get: {
        tags: ['Trade Signals'],
        summary: 'List my trade signals',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'OK' } },
      },
      post: {
        tags: ['Trade Signals'],
        summary: 'Create trade signal (status = pending)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['asset', 'entryPrice', 'stopLoss', 'takeProfit', 'timeframe', 'rationale'],
                properties: {
                  asset: { type: 'string', example: 'BTC' },
                  entryPrice: { type: 'number' },
                  stopLoss: { type: 'number' },
                  takeProfit: { type: 'number' },
                  timeframe: { type: 'string' },
                  rationale: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/trade-signals/admin': {
      get: {
        tags: ['Trade Signals'],
        summary: 'List all trade signals (admin only)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'OK' }, 403: { description: 'Forbidden' } },
      },
    },
    '/trade-signals/{id}': {
      get: {
        tags: ['Trade Signals'],
        summary: 'Get trade signal by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'OK' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Trade Signals'],
        summary: 'Update trade signal (owner; cannot set status)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  asset: { type: 'string' },
                  entryPrice: { type: 'number' },
                  stopLoss: { type: 'number' },
                  takeProfit: { type: 'number' },
                  timeframe: { type: 'string' },
                  rationale: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
      delete: {
        tags: ['Trade Signals'],
        summary: 'Delete trade signal',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'OK' } },
      },
    },
    '/upload/image': {
      post: {
        tags: ['Upload'],
        summary: 'Upload image (for trade signal)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: { image: { type: 'string', format: 'binary' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Returns { url }' }, 400: { description: 'No file or invalid type' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/trade-signals/{id}/status': {
      patch: {
        tags: ['Trade Signals'],
        summary: 'Approve or reject signal (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: { status: { type: 'string', enum: ['approved', 'rejected'] } },
              },
            },
          },
        },
        responses: { 200: { description: 'OK' }, 403: { description: 'Forbidden' } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
};

export function setupSwagger(app: Application, basePath: string = '/api-docs'): void {
  app.use(basePath, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
