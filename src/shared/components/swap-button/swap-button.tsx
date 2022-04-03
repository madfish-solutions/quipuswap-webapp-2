import { useState } from 'react';

import cx from 'classnames';

import { SwapIcon } from '@shared/svg';

import { Button } from '../button';
import s from './swap-button.module.scss';

export interface SwapButtonProps {
  onClick: () => void;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ onClick }) => {
  const [rotateChevron, setRotateChevron] = useState(false);

  const handleRotate = () => {
    setRotateChevron(!rotateChevron);
    onClick();
  };

  const compoundClassName = cx({ [s.rotate]: rotateChevron }, { [s.norotate]: !rotateChevron }, s.iconButton);

  return (
    <Button theme="quaternary" className={compoundClassName} onClick={handleRotate}>
      <SwapIcon />
    </Button>
  );
};
