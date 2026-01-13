// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7db835993ca7278408e82dcba1bb4ad9@o4510700333170688.ingest.us.sentry.io/4510700333367296",

  // Sample 10% of traces in production for cost/performance balance
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // SECURITY: Disable PII collection to protect user privacy
  // User IPs, emails, and other personal data will not be sent to Sentry
  sendDefaultPii: false,

  // Scrub sensitive data from error reports
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
      delete event.request.headers['x-forwarded-for'];
    }
    // Remove sensitive cookies
    if (event.request?.cookies) {
      event.request.cookies = {};
    }
    return event;
  },
});
