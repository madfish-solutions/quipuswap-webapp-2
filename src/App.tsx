/* eslint-disable import/no-default-export */

import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { ConnectWalletButton } from './shared/components/connect-button';
import { Layout } from './layout';

export default function App() {
  return (
    <div className="App">
      <Layout>
        <ConnectWalletButton/>
      </Layout>
    </div>
  );
}
