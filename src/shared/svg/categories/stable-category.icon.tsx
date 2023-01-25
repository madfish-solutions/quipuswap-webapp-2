import { FC, useContext } from 'react';

import { DEFAULT_CATEGORY_ICON_SIZE } from '@config/constants';
import { ColorThemeContext } from '@providers/color-theme-context';
import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  colored?: boolean;
}

const asciiLetterA = 97;

const valuesOfDAttribute = [
  'm9 22.5 2.25-3h1.5l2.25 3H9Z',
  'M9.482 12.5c-.092 1.228-.524 2.18-1.147 2.84-.704.748-1.685 1.16-2.8 1.16-1.116 0-2.117-.412-2.84-1.163-.636-.662-1.08-1.613-1.176-2.837h7.963Z',
  'M22.482 12.5c-.092 1.228-.524 2.18-1.146 2.84-.705.748-1.686 1.16-2.801 1.16-1.116 0-2.117-.412-2.84-1.163-.636-.662-1.08-1.613-1.176-2.837h7.963Z',
  'M12 19V1',
  'M5 12v-1a7 7 0 1 1 14 0v1'
];

export const StableCategory: FC<Props> = ({ colored, size = DEFAULT_CATEGORY_ICON_SIZE, stroke }) => {
  const { getId, getUrl } = useSvgHelper('StableCategory');
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <>
        {valuesOfDAttribute.map((value, index) => (
          <path
            d={value}
            stroke={
              colored ? getUrl(String.fromCharCode(asciiLetterA + index)) : stroke ?? themeColors.fillIconCategories
            }
          />
        ))}
      </>
      {colored && (
        <defs>
          <linearGradient id={getId('a')} x1={8} y1={19} x2={16.456} y2={21.378} gradientUnits="userSpaceOnUse">
            <stop stopColor={themeColors.fill1} />
            <stop offset={1} stopColor={themeColors.fill2} />
          </linearGradient>
          <linearGradient id={getId('b')} x1={1} y1={12} x2={10.648} y2={14.442} gradientUnits="userSpaceOnUse">
            <stop stopColor={themeColors.fill1} />
            <stop offset={1} stopColor={themeColors.fill2} />
          </linearGradient>
          <linearGradient id={getId('c')} x1={14} y1={12} x2={23.648} y2={14.442} gradientUnits="userSpaceOnUse">
            <stop stopColor={themeColors.fill1} />
            <stop offset={1} stopColor={themeColors.fill2} />
          </linearGradient>
          <linearGradient id={getId('d')} x1={12} y1={1} x2={13.141} y2={1.009} gradientUnits="userSpaceOnUse">
            <stop stopColor={themeColors.fill1} />
            <stop offset={1} stopColor={themeColors.fill2} />
          </linearGradient>
          <linearGradient id={getId('e')} x1={5} y1={4} x2={20.057} y2={7.705} gradientUnits="userSpaceOnUse">
            <stop stopColor={themeColors.fill1} />
            <stop offset={1} stopColor={themeColors.fill2} />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};
