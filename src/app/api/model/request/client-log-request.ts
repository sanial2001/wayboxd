import type { Level } from 'pino';

export interface ClientLogRequest {
  level: Level;
  log: Record<string, unknown>;
}
