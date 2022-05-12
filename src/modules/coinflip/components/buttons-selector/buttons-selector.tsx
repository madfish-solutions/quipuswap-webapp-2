import { FC, useContext, FunctionComponent, ReactNode } from 'react';

import cx from 'classnames';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

import styles from './buttons-selector.module.scss';
import { useButtonsSelectorViewModel } from './buttons-selector.vm';

interface Props {
  buttons: Array<{
    id: number | string;
    label: ReactNode;
    Icon: FunctionComponent<IconProps>;
  }>;
  activeId: number | string;
  onChange: (id: number | string) => void;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const ButtonsSelector: FC<Props> = ({ buttons, activeId, onChange }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { computedClassName } = useButtonsSelectorViewModel();

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode])}>
      {buttons.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cx(styles.buttonWrapper, modeClass[colorThemeMode], computedClassName(id, activeId))}
        >
          <Icon className={styles.token} />
          <span className={cx(styles.label, modeClass[colorThemeMode])}>{label}</span>
        </button>
      ))}
    </div>
  );
};
