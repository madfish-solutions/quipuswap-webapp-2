import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  colored?: boolean;
}

export const StableCategory: FC<Props> = ({ colored }) => {
  const { getId, getUrl } = useSvgHelper('StableCategory');
  const { themeColors, colorThemeMode } = useContext(ColorThemeContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fill = colored ? `url(#SettingsMode-${colorThemeMode}paint0_linear)` : themeColors.fillLogo;

  return (
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m9 22.5 2.25-3h1.5l2.25 3H9Z" stroke={getUrl('a')} />
      <path
        d="M9.482 12.5c-.092 1.228-.524 2.18-1.147 2.84-.704.748-1.685 1.16-2.8 1.16-1.116 0-2.117-.412-2.84-1.163-.636-.662-1.08-1.613-1.176-2.837h7.963Z"
        stroke={getUrl('b')}
      />
      <path
        d="M22.482 12.5c-.092 1.228-.524 2.18-1.146 2.84-.705.748-1.686 1.16-2.801 1.16-1.116 0-2.117-.412-2.84-1.163-.636-.662-1.08-1.613-1.176-2.837h7.963Z"
        stroke={getUrl('c')}
      />
      <path d="M12 19V1" stroke={getUrl('d')} />
      <path d="M5 12v-1a7 7 0 1 1 14 0v1" stroke={getUrl('e')} />
      {ColorModes.Dark === colorThemeMode && (
        <defs>
          <linearGradient id={getId('a')} x1={8} y1={19} x2={16.456} y2={21.378} gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B00" />
            <stop offset={1} stopColor="#F9A605" />
          </linearGradient>
          <linearGradient id={getId('b')} x1={1} y1={12} x2={10.648} y2={14.442} gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B00" />
            <stop offset={1} stopColor="#F9A605" />
          </linearGradient>
          <linearGradient id={getId('c')} x1={14} y1={12} x2={23.648} y2={14.442} gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B00" />
            <stop offset={1} stopColor="#F9A605" />
          </linearGradient>
          <linearGradient id={getId('d')} x1={12} y1={1} x2={13.141} y2={1.009} gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B00" />
            <stop offset={1} stopColor="#F9A605" />
          </linearGradient>
          <linearGradient id={getId('e')} x1={5} y1={4} x2={20.057} y2={7.705} gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF6B00" />
            <stop offset={1} stopColor="#F9A605" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};
