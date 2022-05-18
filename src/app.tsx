import { observer } from 'mobx-react-lite';

import { AppRouter } from '@app.router';
import { UserBalancesSubscription } from '@blockchain';

import { Layout } from './layout';

import './styles/globals.scss';

export const App = observer(() => {
  return (
    <Layout>
      <AppRouter />
      <UserBalancesSubscription />
    </Layout>
  );
});
