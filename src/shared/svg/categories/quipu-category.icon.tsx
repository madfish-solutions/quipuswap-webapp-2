import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

interface Props extends IconProps {
  colored?: boolean;
}

const asciiLetterA = 97;

const valuesOfDAttribute = [
  'm12.724 17.004 3.861 3.864-3.861-3.864Zm0 0a1.068 1.068 0 0 1 .45-1.782c.332-.101.707-.035.99.201m-1.44 1.58 1.44-1.58m0 0 3.935 3.933a1.068 1.068 0 0 1-.215 1.68c-.412.24-.948.182-1.298-.168l-2.422-5.445Zm6.71 1.159a1.068 1.068 0 0 1-.227 1.685c-.41.232-.94.173-1.286-.173L15.5 14.23a1.075 1.075 0 0 1-.238-1.158 1.07 1.07 0 0 1 1.75-.356l3.861 3.865ZM2.958 10.985c0 4.426 3.6 8.023 8.028 8.023.38 0 .757-.024 1.13-.078l1.795 1.794c-.927.279-1.907.429-2.925.429-5.608 0-10.174-4.56-10.174-10.168C.812 5.381 5.373.817 10.986.817c5.612 0 10.174 4.564 10.174 10.168 0 1.039-.158 2.045-.45 2.99l-1.787-1.786c.06-.393.09-.797.09-1.204 0-4.425-3.6-8.023-8.027-8.023-4.428 0-8.028 3.598-8.028 8.023Z'
];

export const QuipuCategory: FC<Props> = ({ colored }) => {
  const { getId, getUrl } = useSvgHelper('QuipuCategory');
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width={22} height={22} fill="none" xmlns="http://www.w3.org/2000/svg">
      {valuesOfDAttribute.map((value, index) => (
        <path
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
