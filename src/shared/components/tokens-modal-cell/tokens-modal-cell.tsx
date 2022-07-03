import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { Bin, Checkbox } from '@shared/elements';
import { getTokenName, getTokenSymbol } from '@shared/helpers';
import { ManagedToken } from '@shared/types';

import { StateCurrencyAmount } from '../state-components';
import { TokensLogos } from '../tokens-logo';
import styles from './tokens-modal-cell.module.scss';

export interface TokensModalCellProps {
  token: ManagedToken & { isChoosen: boolean };
  onDeleteToken: () => void;
  onTokenClick: () => void;
  balance?: Nullable<BigNumber.Value>;
}

export const TokensModalCell: FC<TokensModalCellProps> = ({ token, onTokenClick, balance, onDeleteToken }) => (
  <div className={styles.tokensModalCell} onClick={onTokenClick}>
    <Bin className={styles.bin} onClick={onDeleteToken} />

    <TokensLogos tokens={token} />

    <div>
      <h6 className={styles.tokenName}>{getTokenName(token)}</h6>
      <div className={styles.tokenSymbol}>{getTokenSymbol(token)}</div>
    </div>

    <div className={styles.checkboxContainer}>
      {balance && <StateCurrencyAmount amount={balance} />}
      <Checkbox className={styles.checkbox} checked={token.isChoosen} />
    </div>
  </div>
);
