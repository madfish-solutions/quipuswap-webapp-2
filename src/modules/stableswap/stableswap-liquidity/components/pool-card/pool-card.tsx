import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { Card, NewTokensLogos } from '@shared/components';

import styles from './pool-card.module.scss';
export const PoolCard = () => {
  const tokens = [DEFAULT_TOKEN, TEZOS_TOKEN, DEFAULT_TOKEN, TEZOS_TOKEN].map(
    ({ metadata: { symbol, thumbnailUri } }) => ({ tokenIcon: thumbnailUri, tokenSymbol: symbol })
  );

  return (
    <Card contentClassName={styles.poolCard}>
      <div className={styles.info}>
        <NewTokensLogos tokens={tokens} width={48} />
      </div>
      <div className={styles.stats}>Stats</div>
    </Card>
  );
};
