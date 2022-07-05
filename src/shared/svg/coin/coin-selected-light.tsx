import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const CoinSelectedLightIcon: FC<IconProps> = ({ className, ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSelectedLight');

  return (
    <svg viewBox="0 0 135 135" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x={2} y={2} width={128} height={128} rx={66} stroke={getUrl('a')} strokeWidth={4} />
      <defs>
        <linearGradient id={getId('a')} x1={0} y1={0} x2={158.828} y2={22.335} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
      </defs>
    </svg>
  );
};
