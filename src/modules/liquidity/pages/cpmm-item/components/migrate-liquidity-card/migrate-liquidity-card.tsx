import { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, Tooltip } from '@shared/components';
import { MigrateLiquidityIcon } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './migrate-liquidity-card.module.scss';

export const MigrateLiquidityCard = () => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Card
      className={cx(styles.migrateCard, {
        [styles.dark]: colorThemeMode === ColorModes.Dark,
        [styles.light]: colorThemeMode === ColorModes.Light
      })}
      isV2
    >
      <span>
        <div className={styles.heyBro}>
          {t('liquidity|heyBro')}
          <Tooltip content={<div>Tooltip!</div>} />
        </div>
        <span className={styles.migrateDescription}>{t('liquidity|migrateAssets')}</span>
        <span className={styles.why}>{t('liquidity|why')}</span>
      </span>
      <MigrateLiquidityIcon />
    </Card>
  );
};
