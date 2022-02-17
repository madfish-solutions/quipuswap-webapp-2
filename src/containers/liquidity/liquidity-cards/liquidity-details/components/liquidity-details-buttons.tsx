import React, { FC } from 'react';

import { FoundDex } from '@quipuswap/sdk';
import { ExternalLink } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Skeleton } from '@components/common/Skeleton';
import { Button } from '@components/ui/elements/button';
import { Nullable, Optional } from '@interfaces/types';

import s from '../liquidity-details.module.sass';

interface Props {
  dex: Optional<FoundDex>;
  pairLink: Nullable<string>;
  contractLink: Nullable<string>;
}

export const LiquidityDetailsButtons: FC<Props> = ({ dex, pairLink, contractLink }) => {
  const { t } = useTranslation(['common', 'liquidity']);

  return (
    <div className={s.LiquidityDetails_DetailsButtons}>
      {dex && pairLink ? (
        <Button
          className={s.LiquidityDetails_DetailsButtons_Button}
          theme="inverse"
          href={pairLink}
          external
          icon={<ExternalLink className={s.LiquidityDetails_DetailsButtons_Button_Icon} />}
        >
          {t('liquidity|Pair Analytics')}
        </Button>
      ) : (
        <Skeleton className={cx(s.buttonSkel, s.LiquidityDetails_DetailsButtons_Button)} />
      )}
      {dex && contractLink ? (
        <Button
          className={s.LiquidityDetails_DetailsButtons_Button}
          theme="inverse"
          href={contractLink}
          external
          icon={<ExternalLink className={s.LiquidityDetails_DetailsButtons_Button_Icon} />}
        >
          {t('liquidity|Pair Contract')}
        </Button>
      ) : (
        <Skeleton className={cx(s.buttonSkel, s.LiquidityDetails_DetailsButtons_Button)} />
      )}
    </div>
  );
};
