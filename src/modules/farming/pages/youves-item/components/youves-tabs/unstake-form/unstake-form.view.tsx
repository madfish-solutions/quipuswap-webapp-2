import { FC } from 'react';

import { BigNumber } from 'bignumber.js';
import { observer } from 'mobx-react-lite';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { Token } from '@shared/types';
import s from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

interface Props {
  inputAmount: string;
  isSubmitting: boolean;
  handleSubmit: () => void;
  userTokenBalance: BigNumber;
  disabled: boolean;
  handleInputAmountChange: (value: string) => void;
  tokens: Array<Token>;
}

export const UnstakeFormView: FC<Props> = observer(
  ({ inputAmount, isSubmitting, handleSubmit, userTokenBalance, disabled, handleInputAmountChange, tokens }) => {
    const { t } = useTranslation();

    return (
      <form onSubmit={handleSubmit}>
        <TokenInput
          id="unstake-form"
          label={t('common|Amount')}
          value={inputAmount}
          balance={userTokenBalance}
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
  }
);
