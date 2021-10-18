import React, { useState, useCallback } from 'react';
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

  const handleRotate = useCallback(() => {
    setRotateChevron(!rotateChevron);
    onClick();
  }, [rotateChevron, setRotateChevron, onClick]);

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
