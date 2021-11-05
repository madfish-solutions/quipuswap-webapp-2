import React, { useState } from 'react';
import { Button, SwapIcon } from '@madfish-solutions/quipu-ui-kit';
import cx from 'classnames';

import s from './SwapButton.module.sass';

type SwapButtonProps = {
  onClick:() => void
};

export const SwapButton:React.FC<SwapButtonProps> = ({
  onClick,
}) => {
  const [rotateChevron, setRotateChevron] = useState(false);

  const handleRotate = () => {
    setRotateChevron(!rotateChevron);
    onClick();
  };

  const compoundClassName = cx(
    { [s.rotate]: rotateChevron },
    { [s.norotate]: !rotateChevron },
    s.iconButton,
  );

  return (
    <Button
      theme="quaternary"
      className={compoundClassName}
      onClick={handleRotate}
    >
      <SwapIcon />
    </Button>
  );
};
