/* eslint-disable import/no-default-export */

import { Layout } from './layout';
import { Router } from './router';

import './styles/globals.scss';

export default function App() {
  return (
    <Layout>
      <Router />
    </Layout>
  );
}
