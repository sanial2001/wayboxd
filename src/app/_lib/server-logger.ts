import pino from 'pino';
import pinoCaller from 'pino-caller';

function resolveLogLevel(): pino.LevelWithSilent {
  const fromEnv = process.env.LOG_LEVEL?.trim();
  if (fromEnv) {
    return fromEnv as pino.LevelWithSilent;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

export const serverLogger = pinoCaller(
  pino({
    level: resolveLogLevel(),
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  })
);
