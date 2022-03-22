import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { ConnectWalletOrDoSomething } from '@components/common/connect-wallet-or-do-something';
import { TokenInput } from '@components/ui/ComplexInput';
import { Button } from '@components/ui/elements/button';
import s from '@styles/CommonContainer.module.sass';

import { useUnstakingFormViewModel } from './use-unstaking-form.vm';

export const UnstakingForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const {
    inputAmount,
    isSubmitting,
    handleSubmit,
    userTokenBalance,
    inputAmountError,
    stakeItem,
    stakedTokenDecimals,
    disabled,
    handleInputAmountChange
  } = useUnstakingFormViewModel();

  if (!stakeItem) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="unstaking-form"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
        decimals={stakedTokenDecimals}
        error={inputAmountError}
        tokenA={stakeItem.tokenA}
        tokenB={stakeItem.tokenB}
        onInputChange={handleInputAmountChange}
      />
      <div className={s.buttons}>
        <ConnectWalletOrDoSomething>
          <Button type="submit" className={s.button} disabled={disabled} loading={isSubmitting}>
            {t('stake|Unstake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
