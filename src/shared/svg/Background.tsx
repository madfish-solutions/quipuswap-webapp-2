import { FC } from 'react';

// import { ColorThemeContext } from '@quipuswap/ui-kit';

import { isClient } from '@shared/helpers/is-client';

import background from './Desktopdark.png';

export const Background: FC<IconProps> = ({ className }) => {
  // const { colorThemeMode } = useContext(ColorThemeContext);

  if (!isClient) {
    return null;
  }

  return <img src={background} alt="background" className={className} />;
};
