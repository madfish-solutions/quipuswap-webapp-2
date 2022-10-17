import { FC } from 'react';

import { BigNumber } from 'bignumber.js';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { Token } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

interface Props {
  inputAmount: string;
  handleSubmit: () => void;
  userTokenBalance: BigNumber;
  tokens: Array<Token>;
  handleInputAmountChange: (value: string) => void;
  disabled: boolean;
  isSubmitting: boolean;
}

export const StakeFormView: FC<Props> = ({
  inputAmount,
  handleSubmit,
  userTokenBalance,
  tokens,
  handleInputAmountChange,
  disabled,
  isSubmitting
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="stake-form"
        label={t('common|Amount')}
        value={inputAmount}
        balance={userTokenBalance}
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
