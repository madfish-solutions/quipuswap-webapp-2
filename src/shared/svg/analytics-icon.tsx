import { FC } from 'react';

import { IconProps } from '@shared/types';

export const AnalyticsIcon: FC<IconProps> = ({ className, id, ...props }) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path
      d="m2 15 4.256-3.84a2 2 0 0 1 2.224-.31l1.757.867a2 2 0 0 0 2.558-.698l2.596-3.964a2 2 0 0 1 3.085-.32L22 10.25M3 20v-2m3 2v-4m3 4v-3m3 3v-3m3 3v-5m3 5v-8m3 8v-6"
      strokeWidth={1.5}
      stroke="#8B90A0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
