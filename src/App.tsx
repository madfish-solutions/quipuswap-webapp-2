/* eslint-disable import/no-default-export */

import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { Link } from 'react-router-dom';

import { Layout } from './layout';
import { Router, routes } from './router';

export default function App() {
  return (
    <Layout>
      <Link to={routes.home}>Home</Link>
      <Link to={routes.privacyPolicy}>Privacy Policy</Link>
      <Link to={routes.termsOfService}>Terms of Service</Link>
      <Router />
    </Layout>
  );
}
