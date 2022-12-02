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
  handleButtonClick: (index: number) => void;
  className?: string;
}

export const AssetSwitcher: FC<Props> = ({ labels, activeIndex, handleButtonClick, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, className, modeClass[colorThemeMode])}>
      {labels.map((label, index) => (
        <Button
          onClick={() => handleButtonClick(index)}
          className={styles.button}
          theme={isEqual(index, activeIndex) ? 'primary' : 'tertiary'}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};
