import * as Sentry from "@sentry/nextjs";

// Server side Sentry. No-op without SENTRY_DSN. Server errors carry no
// visitor choice, so every personal field is stripped before sending.
export function initServerSentry(): void {
  if (!process.env.SENTRY_DSN) return;
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeSend(event) {
      delete event.user;
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
        delete event.request.data;
        delete event.request.query_string;
      }
      return event;
    },
  });
}

export const onRequestError = Sentry.captureRequestError;
