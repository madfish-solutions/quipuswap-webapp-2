import React, { useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers';

export const FallbackLogo: React.FC<IconProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const topColor = colorThemeMode === ColorModes.Dark ? '#14171E' : '#A1A4B1';
  const botColor = colorThemeMode === ColorModes.Dark ? '#505565' : '#F0F1F3';

  return (
    <svg
      width="128"
      height="128"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z"
        fill={topColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M64 6.10352e-05C28.6538 6.10352e-05 0 28.6538 0 64.0001C0 99.3463 28.6538 128 64 128C99.3462 128 128 99.3463 128 64.0001C128 28.6538 99.3462 6.10352e-05 64 6.10352e-05ZM35.7159 58.3431C32.5917 61.4673 32.5917 66.5327 35.7159 69.6568L58.3433 92.2843C61.4675 95.4085 66.5328 95.4085 69.657 92.2843L92.2844 69.6568C95.4086 66.5327 95.4086 61.4673 92.2844 58.3431L69.657 35.7157C66.5328 32.5915 61.4675 32.5915 58.3433 35.7157L35.7159 58.3431Z"
        fill={botColor}
      />
    </svg>
  );
};
