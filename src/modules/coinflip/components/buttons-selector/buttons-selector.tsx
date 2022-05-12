import { FC, FunctionComponent } from 'react';

import cx from 'classnames';

import { IconProps } from '@shared/types';

import styles from './buttons-selector.module.scss';

interface Props {
  buttons: Array<{
    id: number;
    label: string;
    Icon: FunctionComponent<IconProps>;
  }>;
  activeId: number;
  onChangeId: (index: number) => void;
}

export const ButtonsSelector: FC<Props> = ({ buttons, activeId, onChangeId }) => (
  <>
    {buttons.map(({ id, label, Icon }) => (
      <button
        key={id}
        onClick={() => onChangeId(id)}
        className={cx(styles.buttonWrapper, { [styles.activeButton]: activeId === id })}
      >
        <Icon className={styles.token} />
        <p className={styles.label}>{label}</p>
      </button>
    ))}
  </>
);
