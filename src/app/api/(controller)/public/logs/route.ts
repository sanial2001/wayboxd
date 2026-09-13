import { serverLogger } from '@/app/_lib/server-logger';
import { ClientLogRequest } from '@/app/api/model/request/client-log-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import type { Level } from 'pino';
import { NextRequest } from 'next/server';

const PINO_LEVELS: Level[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

function resolveClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }
  return request.headers.get('x-real-ip');
}

function parseClientLogRequest(body: unknown): ClientLogRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  const candidate = body as Record<string, unknown>;
  const level = candidate.level;
  const log = candidate.log;
  if (typeof level !== 'string' || !PINO_LEVELS.includes(level as Level)) {
    return null;
  }
  if (!log || typeof log !== 'object' || Array.isArray(log)) {
    return null;
  }
  return { level: level as Level, log: log as Record<string, unknown> };
}

function writeClientLog(level: Level, log: Record<string, unknown>): void {
  switch (level) {
    case 'trace':
      serverLogger.trace(log);
      break;
    case 'debug':
      serverLogger.debug(log);
      break;
    case 'info':
      serverLogger.info(log);
      break;
    case 'warn':
      serverLogger.warn(log);
      break;
    case 'error':
      serverLogger.error(log);
      break;
    case 'fatal':
      serverLogger.fatal(log);
      break;
    default:
      serverLogger.info(log);
      break;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = parseClientLogRequest(body);
    if (!parsed) {
      return createApiResponse({
        error: 'Invalid log payload',
        status: 400,
      });
    }

    const enrichedLog: Record<string, unknown> = {
      ...parsed.log,
      client: request.headers.get('user-agent'),
      ip: resolveClientIp(request),
      host: request.headers.get('host'),
    };

    writeClientLog(parsed.level, enrichedLog);

    return createApiResponse({
      data: { message: 'Log received' },
      status: 200,
    });
  } catch (error) {
    serverLogger.error(error, 'Error processing client log');
    return createApiResponse({
      error: 'Failed to process log',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}
