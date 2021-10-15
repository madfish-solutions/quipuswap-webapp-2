import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Skeleton } from '@components/ui/Skeleton';
import { Loader } from '@components/ui/Loader';
import { ArrowDown } from '@components/svg/ArrowDown';

import s from '../FarmingCard.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const StakingCardLoader: React.FC<{}> = () => {
  const { t } = useTranslation(['common', 'farms']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.mb24i,
    s.govBody,
  );
  return (
    <Card
      className={cx(s.card, compountClassName)}
      contentClassName={s.content}
    >
      <div className={s.header}>
        <div className={s.tokens}>
          <Skeleton className={s.image} />
          <h3 className={s.title}>
            <Skeleton className={s.skeletonPairTitle} />
          </h3>

        </div>
        <div className={s.onlyDesktop}>
          <Skeleton className={s.skeletonLink} />
          <Skeleton className={s.skeletonLink} />
          <Skeleton className={s.skeletonLink} />
        </div>

      </div>
      <div className={s.footer2}>
        <div className={s.firstBlock}>
          <ArrowDown className={s.arrow} />
          <div className={s.tokenItem}>
            <Skeleton className={s.image} />
            <span className={s.bold600}>{t('farms|Earn')}</span>
            {' '}
            <Skeleton className={s.skeletonSmallText} />
          </div>
        </div>
        <div className={s.detailsBlockSkel}>
          <div className={s.detailsHeader}>
            {t('common|TVL')}
          </div>
          <div className={s.detailsValue}>
            <span className={s.tvl}>$</span>
            {' '}
            <Skeleton className={s.skeletonSmallText} />
          </div>
        </div>
        <div className={s.detailsBlockSkel}>
          <div className={s.detailsHeader}>
            {t('common|APY')}
            {' '}
            <Skeleton className={s.skeletonApyIcon} />
          </div>
          <div className={s.detailsValue}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
        </div>
        <div className={s.detailsBlockSkel}>
          <div className={s.detailsHeader}>
            {t('common|Daily')}
          </div>
          <div className={s.detailsValue}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
        </div>
        <div className={s.detailsBlockSkel}>
          <div className={s.detailsHeader}>
            {t('common|Balance')}
          </div>
          <div className={s.detailsValue}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
        </div>
        <div className={s.detailsBlockSkel}>
          <div className={s.detailsHeader}>
            {t('common|Deposit')}
          </div>
          <div className={s.detailsValue}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
        </div>
        <div className={s.detailsBlockSkel}>
          <div className={s.detailsHeader}>{t('farms|Earned')}</div>
          <div className={s.detailsValue}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
        </div>
        <div className={cx(s.links, s.onlyMobile)}>
          <div className={s.link}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
          <div className={s.link}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
          <div className={s.link}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
          <div className={s.link}>
            <Skeleton className={s.skeletonSmallText} />
          </div>
        </div>
        <Button className={s.button}>
          <Loader className={s.loader} />
        </Button>
      </div>
    </Card>
  );
};
