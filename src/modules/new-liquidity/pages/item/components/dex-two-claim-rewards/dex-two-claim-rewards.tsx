import { observer } from 'mobx-react-lite';
import { noop } from 'rxjs';

import { TEZOS_TOKEN } from '@config/tokens';
import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import stylesCommonContainer from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { useDexTwoClaimRewardsFromViewModel } from './use-dex-two-claim-rewards.vm';

export const DexTwoClaimRewardsFrom = observer(() => {
  const { t } = useTranslation();
  const { rewardValue, rewardDollarEquivalent, balance, disabled, loading, doClaim } =
    useDexTwoClaimRewardsFromViewModel();

  return (
    <div>
      <TokenInput
        value={rewardValue}
        label={t('newLiquidity|bakerReward')}
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
            disabled={disabled}
            loading={loading}
            data-test-id="dexTwoClaimRewardsButton"
          >
            {t('common|Claim')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </div>
  );
});
