// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://7db835993ca7278408e82dcba1bb4ad9@o4510700333170688.ingest.us.sentry.io/4510700333367296",

  // Sample 10% of traces in production for cost/performance balance
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // SECURITY: Disable PII collection to protect user privacy
  sendDefaultPii: false,

  // Prevent capturing sensitive user input
  beforeSend(event) {
    // Scrub form data from breadcrumbs
    if (event.breadcrumbs) {
      event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
        if (breadcrumb.data?.['ui.input']) {
          breadcrumb.data['ui.input'] = '[Filtered]';
        }
        return breadcrumb;
      });
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
