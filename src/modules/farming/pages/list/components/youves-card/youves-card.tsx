import { FC, useContext } from 'react';

import cx from 'classnames';

import { YOUVES_LINK } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, Card } from '@shared/components';
import { YouvesIcon } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './youves-card.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const YouvesCard: FC = () => {
  const { t } = useTranslation(['common', 'farm']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Card contentClassName={styles.content} className={cx(modeClass[colorThemeMode], styles.root)}>
      <YouvesIcon className={styles.youvesIcon} />
      <p className={styles.youvesCheckout}>{t('farm|YouvesCheckout')}</p>
      <Button className={styles.button} external href={YOUVES_LINK} theme="secondary">
        {t('common|Explore')}
      </Button>
    </Card>
  );
};
