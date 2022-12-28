import { FC } from 'react';

import cx from 'classnames';

import { ColorModes } from '@providers/color-theme-context';
import { LabelComponent, ListItemCard, ListItemCardProps } from '@shared/components';
import { useUiStore } from '@shared/hooks';
import { ActiveStatus } from '@shared/types';
import { useTranslation } from '@translation';

import styles from './positions-list-item-card.module.scss';

export interface PositionsListItemCardProps extends ListItemCardProps {
  isInRange: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const PositionsListItemCard: FC<PositionsListItemCardProps> = ({ isInRange, ...cardProps }) => {
  const { t } = useTranslation();
  const { colorThemeMode } = useUiStore();

  return (
    <div className={styles.root}>
      <ListItemCard {...cardProps} />
      <LabelComponent
        className={styles.rangeLabel}
        contentClassName={cx(
          styles.rangeLabelContent,
          modeClass[colorThemeMode],
          isInRange && styles.inRangeLabelContent
        )}
        status={ActiveStatus.ACTIVE}
        label={isInRange ? t('liquidity|inRange') : t('liquidity|notActive')}
      />
    </div>
  );
};
