import { FC, useContext } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { SINGLE_TOKEN_VALUE } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { StateCurrencyAmount, TokensLogos } from '@shared/components';
import { Checkbox } from '@shared/elements';
import { getTokenName, getTokenSymbol, isEqual } from '@shared/helpers';
import { ManagedToken, Nullable } from '@shared/types';

import styles from './tokens-modal-cell.module.scss';
import { useTokensModalStore } from '../../use-tokens-modal-store';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export interface ExtendTokensModalCellProps extends ManagedToken {
  isChosen: boolean;
  disabled: boolean;
}

export interface TokensModalCellProps {
  token: ExtendTokensModalCellProps;
  onTokenClick: () => void;
  balance?: Nullable<BigNumber.Value>;
}
const BIG_SLICE_AMOUNT = 50;

export const TokensModalCell: FC<TokensModalCellProps> = ({ token, onTokenClick, balance }) => {
  const { maxQuantity } = useTokensModalStore();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div
      className={cx(modeClass[colorThemeMode], styles.tokensModalCell, {
        [styles.active]: token.isChosen,
        [styles.disabled]: token.disabled
      })}
      onClick={onTokenClick}
    >
      <TokensLogos width={32} tokens={token} />

      <div>
        <h6 className={styles.tokenSymbol}>{getTokenSymbol(token, BIG_SLICE_AMOUNT)}</h6>
        <div className={styles.tokenName}>{getTokenName(token, BIG_SLICE_AMOUNT)}</div>
      </div>

      <div className={styles.checkboxContainer}>
        {balance && <StateCurrencyAmount amount={balance} />}
        {!isEqual(maxQuantity, SINGLE_TOKEN_VALUE) && (
          <Checkbox className={styles.checkbox} checked={token.isChosen} disabled={token.disabled} />
        )}
      </div>
    </div>
  );
};
