import ReactDOM from 'react-dom';
import App from './App';
import { DAppProvider } from './providers/use-dapp';
import { WalletWrapper } from './providers/wallet-wrapper';

require('dotenv').config()
console.log(process.env)
ReactDOM.render(
    <DAppProvider>
        <WalletWrapper>
            <App />
        </WalletWrapper>
    </DAppProvider>,
    document.getElementById('root')
);
