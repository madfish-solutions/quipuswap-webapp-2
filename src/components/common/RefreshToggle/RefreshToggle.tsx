import React, { useState } from 'react';
import cx from 'classnames';

import { Refresh } from '@components/svg/Refresh';
import { Button } from '@components/ui/Button';

import s from './RefreshToggle.module.sass';

type RefreshToggleProps = {
  onClick:() => void
};

export const RefreshToggle:React.FC<RefreshToggleProps> = ({
  onClick,
}) => {
  const [rotateChevron, setRotateChevron] = useState(false);

  const handleRotate = () => {
    setRotateChevron(!rotateChevron);
    onClick();
  };

  const compoundClassName = cx(
    { [s.rotate]: rotateChevron },
    s.iconButton,
  );

  return (
    <Button
      theme="quaternary"
      className={compoundClassName}
      onClick={handleRotate}
    >
      <Refresh />
    </Button>
  );
};
