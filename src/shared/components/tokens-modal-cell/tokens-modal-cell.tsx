import { FC, useState } from 'react';

import { Checkbox, Favorite } from '@shared/elements';
import { getTokenName, getTokenSymbol } from '@shared/helpers';
import { Token } from '@shared/types';

import { TokensLogos } from '../tokens-logo';
import styles from './tokens-modal-cell.module.scss';

export interface TokensModalCellProps {
  token: Token & { isChoosen: boolean };
  onTokenClick: () => void;
}

export const TokensModalCell: FC<TokensModalCellProps> = ({ token, onTokenClick }) => {
  //TODO: change to store handler
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className={styles.tokensModalCell} onClick={onTokenClick}>
      <TokensLogos tokens={token} />
      <div>
        <h6 className={styles.tokenName}>{getTokenName(token)}</h6>
        <div className={styles.tokenSymbol}>{getTokenSymbol(token)}</div>
      </div>
      <div className={styles.checkboxContainer}>
        <Favorite checked={isFavorite} onClick={() => setIsFavorite(prev => !prev)} />
        <Checkbox checked={token.isChoosen} />
      </div>
    </div>
  );
};
