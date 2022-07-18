import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Button, ButtonProps } from '@shared/components';
import { i18n } from '@translation';

import styles from './select-tokens-button.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const SelectTokensButton: FC<ButtonProps> = ({ className, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Button className={cx(modeClass[colorThemeMode], styles.selectTokensButton, className)} {...props}>
      <h3>{i18n.t('stableswap|selectTokens')}</h3>
    </Button>
  );
};
