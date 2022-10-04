import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Switcher, TokensLogos } from '@shared/components';
import { FavoriteButton } from '@shared/elements';
import { getTokenName, getTokenSymbol } from '@shared/helpers';
import { ManagedToken } from '@shared/types';

import styles from './managed-tokens-list-modal-cell.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export interface ManagedTokensModalCellProps {
  token: ManagedToken;
  onHideClick: () => void;
  onFavoriteClick: () => void;
}
const BIG_SLICE_AMOUNT = 50;

export const ManagedTokensModalCell: FC<ManagedTokensModalCellProps> = ({ token, onFavoriteClick, onHideClick }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.tokensModalCell, modeClass[colorThemeMode])}>
      <TokensLogos width={32} tokens={token} />

      <div>
        <h6 className={styles.tokenSymbol}>{getTokenSymbol(token, BIG_SLICE_AMOUNT)}</h6>
        <div className={styles.tokenName}>{getTokenName(token, BIG_SLICE_AMOUNT)}</div>
      </div>

      <div className={styles.checkboxContainer}>
        <FavoriteButton checked={Boolean(token.isFavorite)} onClick={onFavoriteClick} />
        <Switcher onClick={onHideClick} value={!Boolean(token.isHidden)} />
      </div>
    </div>
  );
};
