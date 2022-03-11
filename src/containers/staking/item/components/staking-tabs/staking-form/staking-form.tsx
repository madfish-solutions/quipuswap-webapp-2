import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { ConnectWalletOrDoSomething } from '@components/common/connect-wallet-or-do-something';
import { ComplexBaker, TokenInput } from '@components/ui/ComplexInput';
import { Button } from '@components/ui/elements/button';
import s from '@styles/CommonContainer.module.sass';
import { isNull } from '@utils/helpers';

import { StakingAlert } from '../../staking-alert';
import { useStakingFormViewModel } from './use-staking-form.vm';

export const StakingForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const {
    isStakingAlertVisible,
    shouldShowBakerInput,
    handleSubmit,
    inputAmount,
    userTokenBalance,
    inputAmountError,
    stakeItem,
    bakerError,
    disabled,
    handleBakerChange,
    tradeHref,
    investHref,
    handleInputAmountChange
  } = useStakingFormViewModel();

  if (!stakeItem) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="staking-form"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
        error={inputAmountError}
        tokenA={stakeItem.tokenA}
        tokenB={stakeItem.tokenB}
        onInputChange={handleInputAmountChange}
      />
      {shouldShowBakerInput && (
        <ComplexBaker
          label={t('common|Baker')}
          className={s.mt24}
          handleChange={handleBakerChange}
          error={bakerError}
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
      {isStakingAlertVisible && <StakingAlert className={s.mt16} variant={stakeItem.stakeStatus} />}
      <div className={s.buttons}>
        <ConnectWalletOrDoSomething>
          <Button type="submit" className={s.button} disabled={disabled}>
            {t('stake|Stake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
