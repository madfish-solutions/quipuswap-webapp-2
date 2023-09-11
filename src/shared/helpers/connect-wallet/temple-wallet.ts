import { WalletProvider } from '@taquito/taquito';
import { TempleWallet, NotConnectedTempleWalletError, TempleDAppPermission } from '@temple-wallet/dapp';

function assertConnected(perm: TempleDAppPermission): asserts perm {
  if (!perm) {
    throw new NotConnectedTempleWalletError();
  }
}

export class TempleWalletWithPK extends TempleWallet implements WalletProvider {
  async getPK() {
    assertConnected(this.permission);

    return this.permission.publicKey;
  }
}
