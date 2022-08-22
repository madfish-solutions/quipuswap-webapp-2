import { useEffect } from 'react';

import { init, reactRouterV6Instrumentation, withSentryReactRouterV6Routing } from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom';

import { SENTRY_DSN } from '@config/environment';

import { getFullEnvName } from '../helpers';

export class SentryService {
  static _instance: SentryService;
  constructor() {
    if (SentryService._instance) {
      return SentryService._instance;
    }

    SentryService._instance = this;
  }

  init() {
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
      tracesSampleRate: 1.0,
      environment: getFullEnvName()
    });
  }
}

export const SentryRoutes = withSentryReactRouterV6Routing(Routes);
