import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DAppProvider } from './providers/use-dapp';
import { WalletWrapper } from './providers/wallet-wrapper';

ReactDOM.render(
    <DAppProvider>
        <WalletWrapper>
            <App />
        </WalletWrapper>
    </DAppProvider>,
    document.getElementById('root')
);
