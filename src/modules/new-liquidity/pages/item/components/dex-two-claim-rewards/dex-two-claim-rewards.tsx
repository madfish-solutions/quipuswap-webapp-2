import { BigNumber } from 'bignumber.js';
import { observer } from 'mobx-react-lite';
import { noop } from 'rxjs';

import { TEZOS_TOKEN } from '@config/tokens';
import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';

export const DexTwoClaimRewardsFrom = observer(() => {
  return (
    <div>
      <TokenInput
        value={'500'}
        label={'Baker reward'}
        readOnly
        dollarEquivalent={new BigNumber(500)}
        balance={new BigNumber(1000)}
        onInputChange={noop}
        tokens={TEZOS_TOKEN}
      />
      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={stylesCommonContainer.button}
            disabled={false}
            loading={false}
            data-test-id="dexTwoClaimRewardsButton"
          >
            Claim
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </div>
  );
});
