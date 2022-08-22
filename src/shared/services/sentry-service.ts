import { ComponentType, useEffect } from 'react';

import {
  init,
  reactRouterV6Instrumentation,
  withProfiler,
  withSentryReactRouterV6Routing,
  setUser
} from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { User } from '@sentry/types';
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom';

import { SENTRY_DSN } from '@config/environment';

import { getFullEnvName, getRelease } from '../helpers';

class SentryService {
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
      environment: getFullEnvName(),
      release: getRelease()
    });
  }

  withProfiler(app: ComponentType) {
    return withProfiler(app);
  }

  setUser(user: User | null) {
    setUser(user);
  }
}

export const sentryService = new SentryService();

export const SentryRoutes = withSentryReactRouterV6Routing(Routes);
