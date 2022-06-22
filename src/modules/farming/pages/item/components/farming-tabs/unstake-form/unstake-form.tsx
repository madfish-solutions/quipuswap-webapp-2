import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

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
    disabled,
    handleInputAmountChange
  } = useUnstakeFormViewModel();

  if (!farmingItem) {
    return null;
  }
  const { tokens } = farmingItem;

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="unstake-form"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
        error={inputAmountError}
        tokens={tokens}
        onInputChange={handleInputAmountChange}
      />
      <div className={s.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={s.button}
            disabled={disabled}
            loading={isSubmitting}
            data-test-id="unstakeButton"
          >
            {t('farm|Unstake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
});
