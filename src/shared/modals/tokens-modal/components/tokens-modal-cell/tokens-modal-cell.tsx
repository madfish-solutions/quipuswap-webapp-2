import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { StateCurrencyAmount, TokensLogos } from '@shared/components';
import { Checkbox } from '@shared/elements';
import { getTokenName, getTokenSymbol } from '@shared/helpers';
import { ManagedToken } from '@shared/types';

import styles from './tokens-modal-cell.module.scss';

export interface TokensModalCellProps {
  token: ManagedToken & { isChosen: boolean };
  onTokenClick: () => void;
  balance?: Nullable<BigNumber.Value>;
}
const BIG_SLICE_AMOUNT = 50;

export const TokensModalCell: FC<TokensModalCellProps> = ({ token, onTokenClick, balance }) => (
  <div className={styles.tokensModalCell} onClick={onTokenClick}>
    <TokensLogos width={32} tokens={token} />

    <div>
      <h6 className={styles.tokenSymbol}>{getTokenSymbol(token, BIG_SLICE_AMOUNT)}</h6>
      <div className={styles.tokenName}>{getTokenName(token, BIG_SLICE_AMOUNT)}</div>
    </div>

    <div className={styles.checkboxContainer}>
      {balance && <StateCurrencyAmount amount={balance} />}
      <Checkbox className={styles.checkbox} checked={token.isChosen} />
    </div>
  </div>
);
