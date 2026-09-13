import pino from 'pino';
import { logServiceClient } from '@/app/api/client/log-service-client';

function resolveClientLogLevel(): pino.LevelWithSilent {
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

export const clientLogger = pino({
  level: resolveClientLogLevel(),
  browser: {
    write: () => {
      // Suppress default browser console output; logs are forwarded to the server.
    },
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      },
    },
    asObject: true,
    transmit: {
      level: 'info',
      send: (level, logEvent) => {
        logServiceClient(level, logEvent);
      },
    },
  },
});
