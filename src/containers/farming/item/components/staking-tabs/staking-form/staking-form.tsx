import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { ConnectWalletOrDoSomething } from '@components/common/connect-wallet-or-do-something';
import { ComplexBaker, TokenInput } from '@components/ui/ComplexInput';
import { Button } from '@components/ui/elements/button';
import s from '@styles/CommonContainer.module.sass';
import { isNull } from '@utils/helpers';

import { StakingAlert } from '../../farming-alert';
import { useStakingFormViewModel } from './use-staking-form.vm';

export const StakingForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'farm']);
  const {
    bakerInputValue,
    shouldShowBakerInput,
    handleSubmit,
    inputAmount,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    stakedTokenDecimals,
    bakerError,
    stakingStatusError,
    disabled,
    handleBakerChange,
    tradeHref,
    investHref,
    handleInputAmountChange
  } = useStakingFormViewModel();

  if (!farmingItem) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="staking-form"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
        error={inputAmountError}
        tokenA={farmingItem.tokenA}
        tokenB={farmingItem.tokenB}
        onInputChange={handleInputAmountChange}
      />
      {shouldShowBakerInput && (
        <ComplexBaker
          label={t('common|Baker')}
          className={s.mt24}
          handleChange={handleBakerChange}
          error={bakerError}
          value={bakerInputValue}
        />
      )}
      <div className={s.suggestedOperationsButtons}>
        <Button theme="underlined" href={tradeHref}>
          {t('common|Trade')}
        </Button>
        {!isNull(investHref) && (
          <Button theme="underlined" href={investHref}>
            {t('common|Invest')}
          </Button>
        )}
      </div>
      <StakingAlert className={s.mt16} variant={farmingItem.stakeStatus} errorMessage={stakingStatusError} />
      <div className={s.buttons}>
        <ConnectWalletOrDoSomething>
          <Button type="submit" className={s.button} disabled={disabled}>
            {t('farm|Stake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
