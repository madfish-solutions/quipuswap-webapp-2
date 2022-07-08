import { FC, MouseEventHandler, useCallback } from 'react';

import cx from 'classnames';

import { FavoriteOff, FavoriteOn } from '@shared/svg';

import styles from './favorite.module.scss';

interface Props {
  checked: boolean;
  onClick: () => void;
  className?: string;
}

export const FavoriteButton: FC<Props> = ({ className, checked, onClick }) => {
  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    event => {
      event.stopPropagation();
      event.preventDefault();
      onClick();
    },
    [onClick]
  );

  return (
    <div onClick={handleClick} className={cx(styles.favorite, className)}>
      {checked ? <FavoriteOn /> : <FavoriteOff />}
    </div>
  );
};
