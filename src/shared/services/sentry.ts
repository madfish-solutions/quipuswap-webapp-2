import { useEffect } from 'react';

import { init, reactRouterV6Instrumentation, withSentryReactRouterV6Routing } from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom';

import { SENTRY_DSN } from '@config/environment';

export class SentryService {
  constructor() {
    init({
      dsn: SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: reactRouterV6Instrumentation(
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          )
        })
      ],
      tracesSampleRate: 1.0
    });
  }
}

export const SentryRoutes = withSentryReactRouterV6Routing(Routes);
