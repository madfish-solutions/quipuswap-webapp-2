import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { isEqual } from '@shared/helpers';

import styles from './two-asset-switcher.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  tokensSymbols: Array<string>;
  activeId: number;
  handleActiveId: (index: number) => void;
  className?: string;
}

export const TwoAssetSwitcher: FC<Props> = ({ tokensSymbols, activeId, handleActiveId, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, className, modeClass[colorThemeMode])}>
      {tokensSymbols.map((tokenSymbol, index) => (
        <Button
          onClick={() => handleActiveId(index)}
          className={styles.button}
          theme={isEqual(index, activeId) ? 'primary' : 'tertiary'}
        >
          {tokenSymbol}
        </Button>
      ))}
    </div>
  );
};
