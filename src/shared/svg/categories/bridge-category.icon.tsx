import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  colored?: boolean;
}

const asciiLetterA = 97;

const valuesOfDAttribute = [
  'M1 19h22',
  'M18 19v4',
  'M6 19v4',
  'M4 16v3',
  'M20 16v3',
  'M1 16c5.107 0 7.857-1.75 11-7',
  'M23 16c-5.107 0-7.857-1.75-11-7',
  'M8 14v5',
  'M16 14v5',
  'M12 7v12',
  'M14 5h7',
  'M10 5H3',
  'm18 2 3 3-3 3',
  'M6 2 3 5l3 3'
];

export const BridgeCategory: FC<Props> = ({ colored }) => {
  const { getId, getUrl } = useSvgHelper('BridgeCategory');
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
      <defs>
        <linearGradient id={getId('a')} x1={1} y1={19} x2={3.374} y2={26.344} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('b')} x1={18} y1={19} x2={19.139} y2={19.04} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('c')} x1={6} y1={19} x2={7.139} y2={19.04} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('d')} x1={4} y1={16} x2={5.138} y2={16.053} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('e')} x1={20} y1={16} x2={21.138} y2={16.053} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('f')} x1={1} y1={9} x2={12.963} y2={11.643} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('g')} x1={23} y1={9} x2={11.037} y2={11.643} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('h')} x1={8} y1={14} x2={9.14} y2={14.032} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('i')} x1={16} y1={14} x2={17.14} y2={14.032} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('j')} x1={12} y1={7} x2={13.14} y2={7.013} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('k')} x1={14} y1={5} x2={18.055} y2={8.992} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('l')} x1={10} y1={5} x2={5.945} y2={8.992} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('m')} x1={18} y1={2} x2={21.405} y2={2.239} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id={getId('n')} x1={6} y1={2} x2={2.595} y2={2.239} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
