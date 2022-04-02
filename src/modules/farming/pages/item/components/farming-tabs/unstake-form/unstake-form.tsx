import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { useTranslation } from '@shared/hooks';
import s from '@styles/CommonContainer.module.scss';

import { useUnstakeFormViewModel } from './use-unstake-form.vm';

export const UnstakeForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'farm']);
  const {
    inputAmount,
    isSubmitting,
    handleSubmit,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    stakedTokenDecimals,
    disabled,
    handleInputAmountChange
  } = useUnstakeFormViewModel();

  if (!farmingItem) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="unstake-form"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
        error={inputAmountError}
        tokenA={farmingItem.tokenA}
        tokenB={farmingItem.tokenB}
        onInputChange={handleInputAmountChange}
      />
      <div className={s.buttons}>
        <ConnectWalletOrDoSomething>
          <Button type="submit" className={s.button} disabled={disabled} loading={isSubmitting}>
            {t('farm|Unstake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
