import { FC } from 'react';

import { isClient } from '@shared/helpers/is-client';

import background from './background/Desktopdark.png';

export const Background: FC<IconProps> = ({ className }) => {
  if (!isClient) {
    return null;
  }

  return <img src={background} alt="background" className={className} />;
};
