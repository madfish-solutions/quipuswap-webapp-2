import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  colored?: boolean;
}

const asciiLetterA = 97;

const valuesOfDAttribute = [
  'M10 6v12',
  'M12 6v2',
  'M12 16v2',
  'M8 16h6',
  'M8 8h4.922c2.591 0 2.85 4 .26 4',
  'M14 12c2.732 0 2.601 4 0 4',
  'M10 12h4'
];

export const BtcCategory: FC<Props> = ({ colored }) => {
  const { getId, getUrl } = useSvgHelper('BtcCategory');
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <>
        {valuesOfDAttribute.map((value, index) => (
          <path
            d={value}
            stroke={colored ? getUrl(String.fromCharCode(asciiLetterA + index)) : themeColors.fillIconCategories}
          />
        ))}
      </>
      <circle cx={12} cy={12} r={9.5} stroke={colored ? getUrl('h') : themeColors.fillIconCategories} />
      <defs>
        <linearGradient id={getId('a')} x1={10} y1={6} x2={11.14} y2={6.013} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('b')} x1={12} y1={6} x2={13.135} y2={6.08} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('c')} x1={12} y1={16} x2={13.135} y2={16.08} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('d')} x1={8} y1={16} x2={11.998} y2={19.373} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('e')} x1={8} y1={8} x2={15.528} y2={9.853} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('f')} x1={14} y1={16} x2={16.27} y2={15.84} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('g')} x1={10} y1={12} x2={13.466} y2={13.95} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('h')} x1={2} y1={2} x2={24.37} y2={5.146} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
