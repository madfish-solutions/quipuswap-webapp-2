import { FC } from 'react';

import { Favorite } from '@shared/elements';
import { getTokenName, getTokenSymbol } from '@shared/helpers';
import { ManagedToken } from '@shared/types';

import { Switcher } from '../switcher';
import { TokensLogos } from '../tokens-logo';
import styles from './managed-tokens-list-modal-cell.module.scss';

export interface ManagedTokensModalCellProps {
  token: ManagedToken;
  onHideToken: () => void;
  onFavoriteClick: () => void;
}

export const ManagedTokensModalCell: FC<ManagedTokensModalCellProps> = ({ token, onFavoriteClick, onHideToken }) => (
  <div className={styles.tokensModalCell}>
    <TokensLogos tokens={token} />

    <div>
      <h6 className={styles.tokenName}>{getTokenName(token)}</h6>
      <div className={styles.tokenSymbol}>{getTokenSymbol(token)}</div>
    </div>

    <div className={styles.checkboxContainer}>
      <Favorite checked={Boolean(token.isFavorite)} onClick={onFavoriteClick} />
      <Switcher onClick={onHideToken} value={!Boolean(token.isHidden)} />
    </div>
  </div>
);
