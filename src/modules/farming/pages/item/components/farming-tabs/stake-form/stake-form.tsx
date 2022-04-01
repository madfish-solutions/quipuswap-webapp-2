import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { Button, ComplexBaker, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { isNull } from '@shared/helpers';
import s from '@styles/CommonContainer.module.scss';

import { FarmingAlert } from '../../farming-alert';
import { useStakeFormViewModel } from './use-stake-form.vm';

export const StakeForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'farm']);
  const {
    bakerInputValue,
    shouldShowBakerInput,
    handleSubmit,
    inputAmount,
    isSubmitting,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    stakedTokenDecimals,
    bakerError,
    farmStatusError,
    disabled,
    handleBakerChange,
    tradeHref,
    investHref,
    handleInputAmountChange
  } = useStakeFormViewModel();

  if (!farmingItem) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="stake-form"
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
      <FarmingAlert className={s.mt16} variant={farmingItem.stakeStatus} errorMessage={farmStatusError} />
      <div className={s.buttons}>
        <ConnectWalletOrDoSomething>
          <Button type="submit" className={s.button} disabled={disabled} loading={isSubmitting}>
            {t('farm|Stake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
