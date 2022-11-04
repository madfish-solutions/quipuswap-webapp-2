import { FC } from 'react';

import { IconProps } from '@shared/types';

export const DownOfDefaultChart: FC<IconProps> = ({ className }) => (
  <svg width={200} height={100} fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M100 100A99.998 99.998 0 0 0 200 0h-20a80.003 80.003 0 0 1-49.385 73.91A80 80 0 0 1 100 80v20ZM0 0a100 100 0 0 0 100 100V80A80.002 80.002 0 0 1 20 0H0Z"
      fill="#F9A605"
    />
  </svg>
);
