import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { ConnectWalletOrDoSomething } from '@components/common/connect-wallet-or-do-something';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/elements/button';
import s from '@styles/CommonContainer.module.sass';

import { useUnstakingFormViewModel } from './use-unstaking-form.vm';

export const UnstakingForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const {
    inputAmount,
    handleSubmit,
    userTokenBalance,
    inputAmountError,
    stakeItem,
    disabled,
    handleInputAmountChange
  } = useUnstakingFormViewModel();

  if (!stakeItem) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <TokenSelect
        label={t('common|Amount')}
        name="inputAmount"
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
      <div className={s.buttons}>
        <ConnectWalletOrDoSomething>
          <Button type="submit" className={s.button} disabled={disabled}>
            {t('stake|Unstake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
