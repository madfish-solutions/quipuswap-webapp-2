/* eslint-disable import/no-default-export */

import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { Routes, Route } from 'react-router-dom';

import PrivacyPolicy from '@modules/privacy-policy';
import TermsOfService from '@modules/terms-of-service';
import { ConnectWalletButton } from '@shared/components';

import { Layout } from './layout';

export default function App() {
  return (
    <div className="App">
      <Layout>
        <ConnectWalletButton />
        <Routes>
          <Route path="/" element={<h1>hello</h1>} />
          <Route path="/p" element={<PrivacyPolicy />} />
          <Route path="/t" element={<TermsOfService />} />
        </Routes>
      </Layout>
    </div>
  );
}
