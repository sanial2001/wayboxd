import { ClientLogRequest } from '@/app/api/model/request/client-log-request';
import type { Level, LogEvent } from 'pino';

export function logServiceClient(level: Level, logEvent: LogEvent): void {
  const body: ClientLogRequest = { level, log: logEvent as unknown as Record<string, unknown> };
  void fetch('/api/public/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
