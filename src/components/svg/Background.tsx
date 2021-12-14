import React, { useContext } from 'react';

import { ColorThemeContext } from '@quipuswap/ui-kit';
import { isClient } from '@utils/helpers';

export const Background: React.FC<IconProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  if (!isClient) return null;

  return (
    <img
      src={`/svg/Desktop${colorThemeMode}.svg`}
      alt="background"
      className={className}
    />
  );
};
