import { useContext } from 'react';

import GuidesPlaceholder from '@images/create-v3-pool-guides-placeholder.png';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Card } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './guides.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const Guides = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation();

  return (
    <Card
      header={{
        content: t('common|guides')
      }}
      className={modeClass[colorThemeMode]}
      contentClassName={styles.content}
      data-test-id="createV3PoolGuides"
    >
      <img src={GuidesPlaceholder} className={styles.placeholder} alt="" />
    </Card>
  );
};
