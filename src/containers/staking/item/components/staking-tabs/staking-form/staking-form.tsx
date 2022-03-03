import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { ConnectWalletOrDoSomething } from '@components/common/connect-wallet-or-do-something';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/elements/button';
import s from '@styles/CommonContainer.module.sass';

import { StakingFormFields } from './staking-form.interface';
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
      <TokenSelect
        label={t('common|Amount')}
        name={StakingFormFields.inputAmount}
        value={inputAmount}
        balance={userTokenBalance}
        error={inputAmountError}
        token={stakeItem.tokenA}
        blackListedTokens={[]}
        notSelectable
        onChange={event => {
          // @ts-ignore
          handleInputAmountChange(event.target.value || '');
        }}
        handleBalance={handleInputAmountChange}
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
