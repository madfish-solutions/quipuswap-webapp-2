import { observer } from 'mobx-react-lite';

import { Layout } from './layout';
import { Router } from './router';

import './styles/globals.scss';

export const App = observer(() => {
  return (
    <Layout>
      <Router />
    </Layout>
  );
});
