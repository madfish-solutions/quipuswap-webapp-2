/* eslint-disable import/no-default-export */

import '@quipuswap/ui-kit/dist/ui-kit.cjs.development.css';

import { observer } from 'mobx-react-lite';

import { ConnectWalletButton } from '@shared/components';

const App = observer(() => {
  return (
    <div className="App">
      <ConnectWalletButton />
    </div>
  );
});

export default App;
