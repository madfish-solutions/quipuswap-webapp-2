import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';
import { ConnectWalletButton } from './shared/components/connect-button';
import { Layout } from './layout';

function App() {
  return (
    <div className="App">
      <Layout>
        <ConnectWalletButton/>
      </Layout>
    </div>
  );
}

export default App;
