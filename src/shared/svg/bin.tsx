import { FC } from 'react';

import { IconProps } from '@shared/types';

export const BinIcon: FC<IconProps> = ({ id, className }) => (
  <svg id={id} className={className} width={14} height={18} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11 6v10H3V6h8ZM9.5 0h-5l-1 1H0v2h14V1h-3.5l-1-1ZM13 4H1v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4Z"
      fill="#EA2424"
    />
  </svg>
);
