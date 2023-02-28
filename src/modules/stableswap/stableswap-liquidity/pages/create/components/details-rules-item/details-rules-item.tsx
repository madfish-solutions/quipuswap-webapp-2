import { ReactNode, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CFC } from '@shared/types';

import styles from './details-rules-item.module.scss';

interface Props {
  index: number;
  title: ReactNode;
  internalChildren?: ReactNode;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DetailsRulesItem: CFC<Props> = ({ index, title, children, internalChildren }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <>
      <li className={modeClass[colorThemeMode]}>
        <span className={styles.liTitle}>
          <span className={styles.accent}>{index})</span> {title}
        </span>
        {internalChildren}
      </li>
      {children}
    </>
  );
};
