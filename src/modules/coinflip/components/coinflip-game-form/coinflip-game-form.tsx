import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { Noop, Token } from '@shared/types';
import commonStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import styles from './coinflip-game-form.module.scss';

interface Props {
  handleSubmit: Noop;
  amountInput: string;
  amountBalance: Nullable<BigNumber>;
  token: Token;
  onAmountInputChange: (amountInput: string) => void;
}

export const CoinflipGameForm: FC<Props> = ({
  handleSubmit,
  amountInput,
  amountBalance,
  token,
  onAmountInputChange
}) => {
  const { t } = useTranslation(['common', 'coinflip']);

  const inputAmountError = undefined;
  const balance = amountBalance ? amountBalance.toFixed() : null;
  const disabled = false;
  const isSubmitting = false;

  return (
    <form onSubmit={handleSubmit} data-test-id="coinflip-form" className={styles.root}>
      <TokenInput
        id="coinflip-form-amount"
        label={t('common|Amount')}
        value={amountInput}
        balance={balance}
        error={inputAmountError}
        decimals={token.metadata.decimals}
        tokenA={token}
        onInputChange={onAmountInputChange}
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
