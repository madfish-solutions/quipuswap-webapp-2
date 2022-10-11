import { observer } from 'mobx-react-lite';
import { noop } from 'rxjs';

import { TEZOS_TOKEN } from '@config/tokens';
import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';

import { useDexTwoClaimRewardsFromViewModel } from './use-dex-two-claim-rewards.vm';

export const DexTwoClaimRewardsFrom = observer(() => {
  const { rewardValue, rewardDollarEquivalent, balance, doClaim } = useDexTwoClaimRewardsFromViewModel();

  return (
    <div>
      <TokenInput
        value={rewardValue}
        label={'Baker reward'}
        readOnly
        dollarEquivalent={rewardDollarEquivalent}
        balance={balance}
        onInputChange={noop}
        tokens={TEZOS_TOKEN}
      />
      <div className={stylesCommonContainer.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            onClick={doClaim}
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
