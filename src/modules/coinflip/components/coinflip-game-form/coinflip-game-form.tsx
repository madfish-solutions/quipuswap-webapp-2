import { FC } from 'react';

import BigNumber from 'bignumber.js';
import { noop } from 'rxjs';

import { Button, ConnectWalletOrDoSomething, TokenInput } from '@shared/components';
import { Noop, Token } from '@shared/types';
import commonStyles from '@styles/CommonContainer.module.scss';
import { useTranslation } from '@translation';

import { CoinSide, TokenToPlay } from '../../stores';
import { CoinflipGameSelect } from '../coinflip-game-select';
import styles from './coinflip-game-form.module.scss';
import { useCoinflipGameFormViewModel } from './use-coinflip-game-form.vm';

interface Props {
  token: Token;
  payout: Nullable<BigNumber>;
  amountBalance: Nullable<BigNumber>;
  tokenToPlay: TokenToPlay;
  coinSide: Nullable<CoinSide>;
  onCoinSideSelect: (coinSide: Nullable<CoinSide>) => void;
  onAmountInputChange: (amountInput: string) => void;
  handleSubmit: Noop;
}

export const CoinflipGameForm: FC<Props> = ({
  handleSubmit,
  amountBalance,
  payout,
  token,
  onAmountInputChange,
  tokenToPlay,
  coinSide,
  onCoinSideSelect
}) => {
  const { t } = useTranslation();
  const {
    inputAmountError,
    balance,
    disabled,
    isSubmitting,
    handleFormSubmit,
    inputAmount,
    payoutAmount,
    coinSideError,
    handleInputAmountChange,
    handleCoinSideSelect,
    handleCoinFlip
  } = useCoinflipGameFormViewModel(
    tokenToPlay,
    amountBalance,
    payout,
    handleSubmit,
    onAmountInputChange,
    onCoinSideSelect
  );

  return (
    <form onSubmit={handleFormSubmit} data-test-id="coinflip-form" className={styles.root}>
      <CoinflipGameSelect
        tokenToPlay={tokenToPlay}
        coinSide={coinSide}
        handleSelectCoinSide={handleCoinSideSelect}
        error={coinSideError}
      />
      <TokenInput
        id="coinflip-form-amount"
        label={t('common|Amount')}
        value={inputAmount}
        balance={balance}
        error={inputAmountError}
        tokens={token}
        onInputChange={handleInputAmountChange}
        className={styles.input}
      />
      <TokenInput
        id="coinflip-form-payout"
        label={t('common|Payout')}
        value={payoutAmount}
        balance={null}
        tokens={token}
        onInputChange={noop}
        className={styles.input}
      />
      <div className={commonStyles.buttons}>
        <ConnectWalletOrDoSomething>
          <Button
            type="submit"
            onClick={handleCoinFlip}
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
