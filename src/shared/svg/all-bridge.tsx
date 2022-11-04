import { FC } from 'react';

import { IconProps } from '@shared/types';

export const AllBridgeIcon: FC<IconProps> = props => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M2 13h20m-6 6V5m-2 14h4M16 7l4 6m-8 0 4-6M8 19V5M6 19h4M8 7l4 6m-8 0 4-6"
      stroke="#8B90A0"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
