import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { ConnectWalletOrDoSomething } from '@components/common/connect-wallet-or-do-something';
import { TokenInput } from '@components/ui/ComplexInput';
import { Button } from '@components/ui/elements/button';
import s from '@styles/CommonContainer.module.sass';

import { useUnstakingFormViewModel } from './use-unstaking-form.vm';

export const UnstakingForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'farm']);
  const {
    inputAmount,
    handleSubmit,
    userTokenBalance,
    inputAmountError,
    farmingItem,
    stakedTokenDecimals,
    disabled,
    handleInputAmountChange
  } = useUnstakingFormViewModel();

  if (!farmingItem) {
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
        tokenA={farmingItem.tokenA}
        tokenB={farmingItem.tokenB}
        onInputChange={handleInputAmountChange}
      />
      <div className={s.buttons}>
        <ConnectWalletOrDoSomething>
          <Button type="submit" className={s.button} disabled={disabled}>
            {t('farm|Unstake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
