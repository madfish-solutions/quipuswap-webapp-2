import { FC } from 'react';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { StakeProps } from './stake-props.interface';

export const StakeFormView: FC<StakeProps> = ({
  inputAmount,
  handleSubmit,
  userLpTokenBalance,
  tokenA,
  tokenB,
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
        tokens={[tokenA, tokenB]}
        onInputChange={handleInputAmountChange}
        disabled={disabled}
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
