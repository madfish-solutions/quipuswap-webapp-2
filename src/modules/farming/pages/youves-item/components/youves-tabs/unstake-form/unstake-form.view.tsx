import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { FormProps } from '../form-props.interface';

export const UnstakeFormView: FC<FormProps> = observer(
  ({
    inputAmount,
    isSubmitting,
    handleSubmit,
    userLpTokenBalance,
    disabled,
    handleInputAmountChange,
    tokenA,
    tokenB
  }) => {
    const { t } = useTranslation();

    return (
      <form onSubmit={handleSubmit}>
        <TokenInput
          id="unstake-form"
          label={t('common|Amount')}
          value={inputAmount}
          balance={userLpTokenBalance}
          tokens={[tokenA, tokenB]}
          onInputChange={handleInputAmountChange}
          disabled={disabled}
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
  }
);
