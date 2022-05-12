import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { Noop, Token } from '@shared/types';
import commonStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './coinflip-game-form.module.scss';
import { useCoinflipGameFormViewModel } from './use-coinflip-game-form.vm';

interface Props {
  handleSubmit: Noop;
  amountBalance: Nullable<BigNumber>;
  token: Token;
  onAmountInputChange: (amountInput: string) => void;
}

export const CoinflipGameForm: FC<Props> = ({ handleSubmit, amountBalance, token, onAmountInputChange }) => {
  const { t } = useTranslation(['common', 'coinflip']);
  const { inputAmountError, balance, disabled, isSubmitting, handleFormSubmit, inputAmount, handleInputAmountChange } =
    useCoinflipGameFormViewModel(amountBalance, handleSubmit, onAmountInputChange);

  return (
    <form onSubmit={handleFormSubmit} data-test-id="coinflip-form" className={styles.root}>
      <TokenInput
        id="coinflip-form-amount"
        label={t('common|Amount')}
        value={inputAmount}
        balance={balance}
        error={inputAmountError}
        decimals={token.metadata.decimals}
        tokenA={token}
        onInputChange={handleInputAmountChange}
      />
      <div className={commonStyles.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={commonStyles.button}
            disabled={disabled}
            loading={isSubmitting}
            data-test-id="flipButton"
          >
            {t('coinflip|Flip')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
