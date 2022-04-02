import { FC } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Button, Skeleton } from '@shared/components';
import { ExternalLink } from '@shared/svg';
import { Nullable, Optional } from '@shared/types';

import styles from '../liquidity-details.module.scss';

interface Props {
  dex: Optional<FoundDex>;
  pairLink: Nullable<string>;
  contractLink: Nullable<string>;
}

export const LiquidityDetailsButtons: FC<Props> = ({ dex, pairLink, contractLink }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  return (
    <div className={styles.LiquidityDetails_DetailsButtons}>
      {dex && pairLink ? (
        <Button
          className={styles.LiquidityDetails_DetailsButtons_Button}
          theme="inverse"
          href={pairLink}
          external
          icon={<ExternalLink className={styles.LiquidityDetails_DetailsButtons_Button_Icon} />}
        >
          {t('liquidity|Pair Analytics')}
        </Button>
      ) : (
        <Skeleton className={cx(styles.buttonSkel, styles.LiquidityDetails_DetailsButtons_Button)} />
      )}
      {dex && contractLink ? (
        <Button
          className={styles.LiquidityDetails_DetailsButtons_Button}
          theme="inverse"
          href={contractLink}
          external
          icon={<ExternalLink className={styles.LiquidityDetails_DetailsButtons_Button_Icon} />}
        >
          {t('liquidity|Pair Contract')}
        </Button>
      ) : (
        <Skeleton className={cx(styles.buttonSkel, styles.LiquidityDetails_DetailsButtons_Button)} />
      )}
    </div>
  );
};
