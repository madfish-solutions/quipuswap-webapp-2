import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const Logo: React.FC<IconProps> = ({
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#Logo-clip0)">
        <rect x="-0.535565" y="0.535565" width="6.92887" height="26.9289" rx="3.46444" transform="matrix(-1 -4.21468e-08 4.21468e-08 1 26.9286 -2.25724e-08)" fill="url(#Logo-paint0_linear)" stroke={themeColors.stroke} strokeWidth="1.07113" />
        <path d="M23.7581 13.3438C17.9168 13.3438 13.1822 18.0756 13.1822 23.9117C13.1822 29.7478 17.9168 34.4796 23.7581 34.4796C29.5993 34.4796 34.334 29.7478 34.334 23.9117C34.334 18.0756 29.5993 13.3438 23.7581 13.3438Z" fill="url(#Logo-paint1_linear)" stroke={themeColors.stroke} strokeWidth="1.07113" />
        <rect x="-0.535565" y="0.535565" width="6.92887" height="20.9289" rx="3.46444" transform="matrix(-1 -4.214e-08 4.214e-08 1 26.9286 26)" fill="url(#Logo-paint2_linear)" stroke={themeColors.stroke} strokeWidth="1.07113" />
        <path d="M26.5202 26.6709L26.5203 26.6708C28.0466 25.1456 28.0466 22.6727 26.5203 21.1475C24.9937 19.622 22.5184 19.622 20.9918 21.1474C20.9918 21.1474 20.9918 21.1475 20.9918 21.1475L14.3249 27.8106L14.3249 27.8106C12.7985 29.3359 12.7985 31.8087 14.3249 33.334C15.8515 34.8595 18.3267 34.8595 19.8533 33.334L26.5202 26.6709Z" fill="url(#Logo-paint3_linear)" stroke={themeColors.stroke} strokeWidth="1.07113" />
      </g>
      <defs>
        <linearGradient id="Logo-paint0_linear" x1="0" y1="0" x2="9.11029" y2="0.366039" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="Logo-paint1_linear" x1="34.8695" y1="35.0151" x2="31.379" y2="10.1759" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="Logo-paint2_linear" x1="0" y1="0" x2="9.1012" y2="0.465402" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="Logo-paint3_linear" x1="28.2006" y1="35.0137" x2="25.757" y2="17.6251" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <clipPath id="Logo-clip0">
          <rect width="48" height="48" fill={themeColors.stroke} transform="translate(-0.000244141)" />
        </clipPath>
      </defs>
    </svg>
  );
};
