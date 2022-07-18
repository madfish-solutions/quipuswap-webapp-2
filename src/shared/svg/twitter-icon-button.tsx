import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const TwitterIconButton: FC<IconProps> = ({ ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const isDark = colorThemeMode === 'dark';

  return (
    <svg width={25} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.5 2.368a9.617 9.617 0 0 1-2.827.794A5.038 5.038 0 0 0 23.838.37a9.698 9.698 0 0 1-3.129 1.223A4.856 4.856 0 0 0 17.116 0c-2.718 0-4.922 2.26-4.922 5.049 0 .396.042.78.126 1.15C8.228 5.988 4.6 3.979 2.17.922a5.14 5.14 0 0 0-.666 2.54c0 1.751.87 3.297 2.19 4.203a4.834 4.834 0 0 1-2.23-.63v.062c0 2.447 1.697 4.488 3.951 4.95a4.697 4.697 0 0 1-1.297.178c-.317 0-.627-.03-.927-.09.626 2.006 2.444 3.466 4.599 3.505A9.723 9.723 0 0 1 .5 17.733 13.71 13.71 0 0 0 8.048 20c9.058 0 14.01-7.692 14.01-14.365 0-.22-.005-.439-.013-.654A10.1 10.1 0 0 0 24.5 2.368"
        fill={isDark ? '#fff' : '#232735'}
      />
    </svg>
  );
};
