import { FC } from 'react';

import cx from 'classnames';

import { ColorModes } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { useUiStore } from '@shared/hooks';
import { useTranslation } from '@translation';

import styles from './create-pool-option.module.scss';

interface CreatePoolOptionProps {
  imageUrl: string;
  imageAlt: string;
  name: string;
  href: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const CreatePoolOption: FC<CreatePoolOptionProps> = ({ imageUrl, imageAlt, name, href }) => {
  const { t } = useTranslation();
  const uiStore = useUiStore();

  return (
    <div className={cx(styles.root, modeClass[uiStore.colorThemeMode])}>
      <div className={styles.topContent}>
        <img className={styles.img} src={imageUrl} alt={imageAlt} />
        <h2 className={styles.subtitle}>{name}</h2>
      </div>
      <Button className={styles.button} href={href}>
        {t('liquidity|createPool')}
      </Button>
    </div>
  );
};
