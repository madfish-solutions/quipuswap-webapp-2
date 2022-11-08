import { UserBalancesSubscription } from '@blockchain';
import { Layout } from '@layout';
import { sentryService } from '@shared/services';

import { AppRouter } from './app.router';

import './styles/globals.scss';

export const App = sentryService.withProfiler(() => (
  <Layout>
    <AppRouter />
    <UserBalancesSubscription />
  </Layout>
));
