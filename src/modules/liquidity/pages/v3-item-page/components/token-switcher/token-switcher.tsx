import { FC, useContext } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { useLiquidityV3ItemStore } from '@modules/liquidity/hooks';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button } from '@shared/components';
import { isEqual } from '@shared/helpers';

import styles from './token-switcher.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  tokensSymbols: Array<string>;
  className?: string;
}

export const TokenSwitcher: FC<Props> = observer(({ tokensSymbols, className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const store = useLiquidityV3ItemStore();

  return (
    <div className={cx(styles.root, className, modeClass[colorThemeMode])}>
      {tokensSymbols.map((tokenSymbol, index) => (
        <Button
          onClick={() => store.setActiveTokenId(index)}
          className={cx(styles.button, modeClass[colorThemeMode])}
          theme={isEqual(index, store.activeTokenId) ? 'primary' : 'tertiary'}
        >
          {tokenSymbol}
        </Button>
      ))}
    </div>
  );
});
