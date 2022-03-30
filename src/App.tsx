/* eslint-disable import/no-default-export */

import { Link } from 'react-router-dom';

import { ConnectWalletButton } from '@shared/components';

import { Layout } from './layout';
import { Router, routes } from './router';

export default function App() {
  return (
    <Layout>
      <ConnectWalletButton />
      <Link to={routes.home}>Home</Link>
      <Link to={routes.privacyPolicy}>Privacy Policy</Link>
      <Link to={routes.termsOfService}>Terms of Service</Link>
      <Router />
    </Layout>
  );
}
