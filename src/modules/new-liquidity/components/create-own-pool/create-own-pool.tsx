import { FC, useContext } from 'react';

import cx from 'classnames';

import { AppRootRoutes } from '@app.router';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, Card } from '@shared/components';
import { useTranslation } from '@translation';

import styles from './create-own-pool.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const CreateOwnPool: FC = () => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Card contentClassName={styles.content} className={cx(modeClass[colorThemeMode], styles.root)}>
      <p className={styles.text}>{t('newLiquidity|noPool')}</p>
      {/* TODO: change '/create' to enum value */}
      <Button className={styles.button} external href={`${AppRootRoutes.NewLiquidity}/create`} theme="secondary">
        {t('newLiquidity|createPool')}
      </Button>
    </Card>
  );
};
