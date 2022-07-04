import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const CoinSelectedDarkIcon: FC<IconProps> = ({ size, className, ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSelectedDark');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 135 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x={2} y={2} width={128} height={128} rx={66} stroke={getUrl('a')} strokeWidth={4} />
      <defs>
        <linearGradient id={getId('a')} x1={4} y1={4} x2={147.169} y2={24.133} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
      </defs>
    </svg>
  );
};
