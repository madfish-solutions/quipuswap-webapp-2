import { observer } from 'mobx-react-lite';
import TagManager from 'react-gtm-module';

import { UserBalancesSubscription } from '@blockchain';
import { GOOGLE_TAG_MANAGER_ID } from '@config/enviroment';
import { Layout } from '@layout';
import { isProd } from '@shared/helpers';

import { AppRouter } from './app.router';

import './styles/globals.scss';

if (GOOGLE_TAG_MANAGER_ID && isProd()) {
  TagManager.initialize({
    gtmId: GOOGLE_TAG_MANAGER_ID
  });
}

export const App = observer(() => {
  return (
    <Layout>
      <AppRouter />
      <UserBalancesSubscription />
    </Layout>
  );
});
