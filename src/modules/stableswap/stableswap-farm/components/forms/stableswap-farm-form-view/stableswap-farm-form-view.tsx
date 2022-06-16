import { FC, FormEvent } from 'react';

import { BigNumber } from 'bignumber.js';

import { Button, ConnectWalletOrDoSomething, TokenInput, Tokens } from '@shared/components';
import { Optional, Undefined } from '@shared/types';
import styles from '@styles/CommonContainer.module.scss';

export interface StableswapFarmFormViewProps {
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  label: string;
  inputAmount: string;
  balance: Optional<BigNumber.Value>;
  inputAmountError: Undefined<string>;
  tokens: Undefined<Tokens>;
  handleInputAmountChange: (value: string) => void;
  disabled: boolean;
  isSubmitting: boolean;
  buttonText: string;
}

export const StableswapFarmFormView: FC<StableswapFarmFormViewProps> = ({
  handleSubmit,
  label,
  inputAmount,
  balance,
  inputAmountError,
  tokens,
  handleInputAmountChange,
  disabled,
  isSubmitting,
  buttonText
}) => (
  <form onSubmit={handleSubmit}>
    <TokenInput
      id="stake-form"
      label={label}
      value={inputAmount}
      balance={balance}
      error={inputAmountError}
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
          {buttonText}
        </Button>
      </ConnectWalletOrDoSomething>
    </div>
  </form>
);
