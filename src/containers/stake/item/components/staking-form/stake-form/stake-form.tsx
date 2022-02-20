import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { useTranslation } from 'next-i18next';

import { ConnectWalletOrDoSomething } from '@components/common/connect-wallet-or-do-something';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { Button } from '@components/ui/elements/button';
import { useStakeFormViewModel } from '@containers/stake/item/components/staking-form/stake-form/use-stake-form.vm';
import s from '@styles/CommonContainer.module.sass';

export const StakeForm: FC = observer(() => {
  const { t } = useTranslation(['common', 'stake']);
  const {
    formik,
    userTokenBalance,
    balanceError,
    stakeItem,
    bakerError,
    disabled,
    handleBalanceChange,
    handleBakerChange
  } = useStakeFormViewModel();

  if (!stakeItem) {
    return null;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <TokenSelect
        label={t('common|Amount')}
        name="balance"
        value={formik.values.balance}
        balance={userTokenBalance}
        error={balanceError}
        token={stakeItem.tokenA}
        blackListedTokens={[]}
        notSelectable
        onChange={event => {
          // @ts-ignore
          handleBalanceChange(event.target.value || '');
        }}
        handleBalance={handleBalanceChange}
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
