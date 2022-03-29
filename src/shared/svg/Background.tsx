import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers';

import { isClient } from '@shared/helpers/is-client';

export const Background: React.FC<IconProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (!isClient) {
    return null;
  }

  return <img src={`/svg/Desktop${colorThemeMode}.png`} alt="background" className={className} />;
};
