import React, { useState } from 'react';
import { SwapIcon } from '@components/svg/Swap';
import { Button } from '@components/ui/Button';

import s from '@styles/CommonContainer.module.sass';

type SwapButtonProps = {
  onClick:() => void
};

export const SwapButton:React.FC<SwapButtonProps> = ({
  onClick,
}) => {
  const [rotateChevron, setRotateChevron] = useState(false);

  const handleRotate = () => setRotateChevron(!rotateChevron);

  const rotate = rotateChevron ? 'rotate(180deg)' : 'rotate(0)';

  return (
    <Button
      theme="quaternary"
      className={s.iconButton}
      onClick={() => {
        if (onClick) onClick();
        handleRotate();
      }}
      style={{ transform: rotate, transition: 'all 0.2s linear' }}
    >
      <SwapIcon />
    </Button>
  );
};
