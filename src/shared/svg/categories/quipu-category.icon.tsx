import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  colored?: boolean;
}

const asciiLetterA = 97;

const valuesOfDAttribute = [
  'M13.7238 18.0026L13.724 18.0029L17.5854 21.8671L13.7238 18.0026ZM13.7238 18.0026C13.3056 17.5847 13.3056 16.9085 13.7238 16.4906C13.853 16.3615 14.0094 16.2713 14.1733 16.221C14.5064 16.12 14.8809 16.1862 15.1643 16.4223M13.7238 18.0026L15.1643 16.4223M15.1643 16.4223L19.0991 20.355C19.5173 20.773 19.5173 21.4491 19.0991 21.8671C19.0334 21.9327 18.9643 21.986 18.8842 22.035C18.4725 22.2753 17.9361 22.2173 17.5857 21.8673L15.1643 16.4223ZM21.8741 17.5806L21.8743 17.5809C22.2925 17.9988 22.2925 18.675 21.8743 19.0929C21.8068 19.1605 21.7308 19.2173 21.6472 19.2663C21.2378 19.4979 20.7071 19.4391 20.3608 19.093C20.3608 19.093 20.3607 19.093 20.3607 19.0929L16.5009 15.2304C16.5007 15.2301 16.5004 15.2299 16.5002 15.2296C16.1867 14.9124 16.1082 14.4548 16.2628 14.0723C16.3167 13.9416 16.3972 13.8182 16.499 13.7164C16.9173 13.2983 17.5942 13.2983 18.0126 13.7163C18.0126 13.7163 18.0127 13.7164 18.0127 13.7164L21.8741 17.5806ZM3.95819 11.984C3.95819 16.4095 7.5583 20.007 11.9858 20.007C12.3659 20.007 12.743 19.9833 13.1161 19.9296L14.9105 21.7228C13.9839 22.0019 13.004 22.1517 11.9858 22.1517C6.37796 22.1517 1.81152 17.5922 1.81152 11.984C1.81152 6.38045 6.37338 1.81641 11.9858 1.81641C17.5982 1.81641 22.1601 6.38045 22.1601 11.984C22.1601 13.0226 22.0024 14.0286 21.7104 14.9745L19.9226 13.1877C19.9822 12.7954 20.0134 12.3914 20.0134 11.984C20.0134 7.55854 16.4133 3.96111 11.9858 3.96111C7.5583 3.96111 3.95819 7.55854 3.95819 11.984Z'
];

export const QuipuCategory: FC<Props> = ({ colored }) => {
  const { getId, getUrl } = useSvgHelper('QuipuCategory');
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      {valuesOfDAttribute.map((value, index) => (
        <path
          key={index}
          d={value}
          stroke={colored ? getUrl(String.fromCharCode(asciiLetterA + index)) : themeColors.fillIconCategories}
        />
      ))}
      {colored && (
        <defs>
          <linearGradient id={getId('a')} x1={0.312} y1={0.317} x2={24.221} y2={3.682} gradientUnits="userSpaceOnUse">
            <stop stopColor={themeColors.fill1} />
            <stop offset={1} stopColor={themeColors.fill2} />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};
