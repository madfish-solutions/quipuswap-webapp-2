import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { Optional, Token } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

interface Props {
  inputAmount: string;
  handleSubmit: () => void;
  userLpTokenBalance: Optional<BigNumber>;
  tokens: Array<Nullable<Token>>;
  handleInputAmountChange: (value: string) => void;
  disabled: boolean;
  isSubmitting: boolean;
  inputAmountError?: string;
}

export const StakeFormView: FC<Props> = ({
  inputAmount,
  handleSubmit,
  userLpTokenBalance,
  tokens,
  handleInputAmountChange,
  disabled,
  isSubmitting,
  inputAmountError
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="stake-form"
        label={t('common|Amount')}
        value={inputAmount}
        error={inputAmountError}
        balance={userLpTokenBalance}
        tokens={tokens}
        onInputChange={handleInputAmountChange}
      />

      <div className={styles.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            className={styles.button}
            disabled={disabled}
            loading={isSubmitting}
            data-test-id="stakeButton"
          >
            {t('farm|Stake')}
          </Button>
        </ConnectWalletOrDoSomething>
      </div>
    </form>
  );
};
