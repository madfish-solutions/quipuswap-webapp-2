import { FC } from 'react';

import cx from 'classnames';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { isExist } from '@shared/helpers';
import styles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { StakeFormProps } from './stake-form-props.interface';

export const StakeFormView: FC<StakeFormProps> = ({
  inputAmount,
  handleSubmit,
  balance,
  tokens,
  handleInputAmountChange,
  disabled,
  isSubmitting,
  inputAmountError,
  investHref
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <TokenInput
        id="stake-form"
        label={t('common|Amount')}
        value={inputAmount}
        error={inputAmountError}
        balance={balance}
        tokens={tokens}
        onInputChange={handleInputAmountChange}
        disabled={disabled}
      />

      {isExist(investHref) && (
        <Button
          className={cx(styles.mt24, styles.minimalFlex)}
          theme="underlined"
          href={investHref}
          data-test-id="investButton"
        >
          {t('common|Invest')}
        </Button>
      )}

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
