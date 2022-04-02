/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react-lite';

import { Layout } from './layout';
import { Router } from './router';

import './styles/globals.scss';

const App = observer(() => {
  return (
    <Layout>
      <Router />
    </Layout>
  );
});

export default App;
