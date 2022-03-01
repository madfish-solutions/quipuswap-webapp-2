import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { ConnectWalletOrDoSomething } from '@components/common/connect-wallet-or-do-something';
import { ComplexBaker, TokenInput } from '@components/ui/ComplexInput';
import { Button } from '@components/ui/elements/button';
import s from '@styles/CommonContainer.module.sass';

import { useStakingFormViewModel } from './use-staking-form.vm';

export const StakingForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const {
    handleSubmit,
    inputAmount,
    userTokenBalance,
    inputAmountError,
    stakeItem,
    bakerError,
    disabled,
    handleInputAmountChange,
    handleBakerChange
  } = useStakingFormViewModel();

  if (!stakeItem) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="staking"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
        error={inputAmountError}
        tokenA={stakeItem.tokenA}
        tokenB={stakeItem.tokenB}
        blackListedTokens={[]}
        onInputChange={handleInputAmountChange}
      />
      <ComplexBaker label={t('common|Baker')} className={s.mt24} handleChange={handleBakerChange} error={bakerError} />
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
