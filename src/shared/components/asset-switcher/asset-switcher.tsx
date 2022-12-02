import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { isEqual } from '@shared/helpers';

import styles from './asset-switcher.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  labels: Array<string>;
  activeIndex: number;
  handleActiveIndex: (index: number) => void;
  className?: string;
}

export const AssetSwitcher: FC<Props> = ({ labels, activeIndex, handleActiveIndex, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, className, modeClass[colorThemeMode])}>
      {labels.map((label, index) => (
        <Button
          onClick={() => handleActiveIndex(index)}
          className={styles.button}
          theme={isEqual(index, activeIndex) ? 'primary' : 'tertiary'}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
