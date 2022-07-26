import { FC } from 'react';

import { IconProps } from '@shared/types';

import { ConfettiLeftSvg } from './confetti-left';
import { ConfettiRightSvg } from './confetti-right';

export const Confettis: FC<IconProps> = ({ className }) => (
  <div className={className}>
    <ConfettiLeftSvg />
    <ConfettiRightSvg />
  </div>
);
