import { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card, Tooltip } from '@shared/components';
import { MigrateLiquidityIcon } from '@shared/svg';

import styles from './migrate-liquidity-card.module.scss';

export const MigrateLiquidityCard = () => {
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
          Hey, bro!
          <Tooltip content={<div>Tooltip!</div>} />
        </div>
        <span className={styles.migrateDescription}>Please, migrate your assets to the new ecxiting AMM version.</span>
        <span className={styles.why}>Why?</span>
      </span>
      <MigrateLiquidityIcon />
    </Card>
  );
};
