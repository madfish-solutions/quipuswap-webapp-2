/* eslint-disable import/no-default-export */

import { Routes, Route } from 'react-router-dom';

import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { ConnectWalletButton } from '@shared/components';

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ConnectWalletButton />} />
        <Route path="/terms" element={<h1>Terms of Usage</h1>} />
        <Route path="/privacy" element={<h1>Privacy Policy</h1>} />
      </Routes>
    </div>
  );
}
