import { FC } from 'react';

import { TokensLogos } from '@shared/components';
import { getTokenName, getTokenSymbol } from '@shared/helpers';
import { ManagedToken } from '@shared/types';

import styles from './tokens-list-item.module.scss';

interface Props {
  token: ManagedToken;
}

const TOKEN_NAME_MAX_LENGTH = 100;

export const TokensListItem: FC<Props> = ({ token }) => {
  return (
    <div className={styles.item}>
      <TokensLogos width={40} tokens={token} />
      <div>
        <h6 className={styles.tokenSymbol}>{getTokenSymbol(token, TOKEN_NAME_MAX_LENGTH)}</h6>
        <div className={styles.tokenName}>{getTokenName(token, TOKEN_NAME_MAX_LENGTH)}</div>
      </div>
    </div>
  );
};
