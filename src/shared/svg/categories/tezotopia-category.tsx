import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  colored?: boolean;
}

const asciiLetterA = 97;

const valuesOfDAttribute = [
  'M4 16.5H1.5v-13h3v-2h16v2h2v13h-2v2h-5v2h-2v2h-2v-2h-2v-2h-5v-2H4Z',
  'M6 11.5H4.5v-6h2v-1h2v1h2v2H14v-2h1.5v-1h2v1h2v6h-2v1h-2v2h-2v1h-2v-1h-3v-2h-2v-1H6Z'
];

export const TezotopiaCategory: FC<Props> = ({ colored }) => {
  const { getId, getUrl } = useSvgHelper('TezotopiaCategory');
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
      {colored && (
        <defs>
          <linearGradient id={getId('a')} x1={1} y1={1} x2={25.607} y2={4.46} gradientUnits="userSpaceOnUse">
            <stop stopColor={themeColors.fill1} />
            <stop offset={1} stopColor={themeColors.fill2} />
          </linearGradient>
          <linearGradient id={getId('b')} x1={4} y1={4} x2={21.63} y2={7.306} gradientUnits="userSpaceOnUse">
            <stop stopColor={themeColors.fill1} />
            <stop offset={1} stopColor={themeColors.fill2} />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};
