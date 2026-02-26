import { Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config';

function forwardHeaders(
  proxyReq: import('http').ClientRequest,
  req: Request
): void {
  const rid = (req as Request & { requestId?: string }).requestId;
  if (rid) proxyReq.setHeader('x-request-id', rid);
  if (req.headers.authorization) {
    proxyReq.setHeader('authorization', req.headers.authorization);
  }
}

function forwardBody(
  proxyReq: import('http').ClientRequest,
  req: Request
): void {
  const method = (req.method || '').toUpperCase();
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body !== undefined) {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
    proxyReq.write(body);
  }
}

// Use context so proxy sees full path (no Express mount stripping). Only matching paths are proxied.
export const authProxy = createProxyMiddleware('/api/v1/auth', {
  target: config.authServiceUrl,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    forwardHeaders(proxyReq, req);
    forwardBody(proxyReq, req);
  },
});

export const userProxy = createProxyMiddleware('/api/v1/users', {
  target: config.userServiceUrl,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    forwardHeaders(proxyReq, req);
    forwardBody(proxyReq, req);
  },
});

export const tradeSignalProxy = createProxyMiddleware('/api/v1/trade-signals', {
  target: config.tradeSignalServiceUrl,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    forwardHeaders(proxyReq, req);
    forwardBody(proxyReq, req);
  },
});

export const discussionProxy = createProxyMiddleware('/api/v1/discussions', {
  target: config.tradeSignalServiceUrl,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    forwardHeaders(proxyReq, req);
    forwardBody(proxyReq, req);
  },
});
