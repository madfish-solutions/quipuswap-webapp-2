import { FC } from 'react';

import BigNumber from 'bignumber.js';

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
  amountBalance: Nullable<BigNumber>;
  tokenToPlay: TokenToPlay;
  coinSide: Nullable<CoinSide>;
  onCoinSideSelect: (coinSide: CoinSide) => void;
  onAmountInputChange: (amountInput: string) => void;
  handleSubmit: Noop;
}

export const CoinflipGameForm: FC<Props> = ({
  handleSubmit,
  amountBalance,
  token,
  onAmountInputChange,
  tokenToPlay,
  coinSide,
  onCoinSideSelect
}) => {
  const { t } = useTranslation(['common', 'coinflip']);
  const {
    inputAmountError,
    balance,
    disabled,
    isSubmitting,
    handleFormSubmit,
    inputAmount,
    coinSideError,
    handleInputAmountChange,
    handleCoinSideSelect
  } = useCoinflipGameFormViewModel(amountBalance, handleSubmit, onAmountInputChange, onCoinSideSelect);

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
