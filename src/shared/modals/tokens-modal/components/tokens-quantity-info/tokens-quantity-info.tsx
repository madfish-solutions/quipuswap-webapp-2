import { FC } from 'react';

import { AlarmMessage } from '@shared/components';

import { TokensQuantityStatus } from '../../types';
import styles from './tokens-quantity-info.module.scss';

export interface TokensQuantityInfoProps {
  tokensQuantityStatus: TokensQuantityStatus;
  minQuantity: Nullable<number>;
  maxQuantity: Nullable<number>;
}

export const TokensQuantityInfo: FC<TokensQuantityInfoProps> = ({ tokensQuantityStatus, minQuantity, maxQuantity }) => {
  switch (tokensQuantityStatus) {
    case TokensQuantityStatus.OK:
      return null;
    case TokensQuantityStatus.TOO_MANY:
      return (
        <AlarmMessage className={styles.center} message={`Max tokens quantity in stableswap pool is ${maxQuantity} `} />
      );
    case TokensQuantityStatus.TOO_SMALL:
      return (
        <AlarmMessage className={styles.center} message={`Min tokens quantity in stableswap pool is ${minQuantity} `} />
      );
  }
};
