import { useState, MouseEvent } from 'react';

import cx from 'classnames';

import { SwapIcon } from '@shared/svg';

import { Button } from '../button';
import styles from './swap-button.module.scss';

export interface SwapButtonProps {
  onClick: () => void;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ onClick }) => {
  const [rotateChevron, setRotateChevron] = useState(false);

  const handleRotate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRotateChevron(!rotateChevron);
    onClick();
  };

  const compoundClassName = cx(
    { [styles.rotate]: rotateChevron },
    { [styles.norotate]: !rotateChevron },
    styles.iconButton
  );

  return (
    <Button theme="quaternary" className={compoundClassName} onClick={handleRotate} data-test-id="swapButton">
      <SwapIcon id="swap" className={styles.svg} />
    </Button>
  );
};
