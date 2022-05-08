import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const CoinSelectedIcon: FC<IconProps> = ({ className, size, ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSideBIcon');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 136 136"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x={2} y={2} width={132} height={132} rx={66} stroke={getUrl('a')} strokeWidth={4} />
      <defs>
        <linearGradient id={getId('a')} x1={4} y1={4} x2={147.169} y2={24.133} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
      </defs>
    </svg>
  );
};
