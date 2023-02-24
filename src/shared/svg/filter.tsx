import { FC } from 'react';

import { IconProps } from '@shared/types';

export const FilterIcon: FC<IconProps> = ({ id, className, size = 16 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath={`url(#${id}-clip0_77_80253)`}>
      <path d="M4.66666 4.00033H11.3333L7.99333 8.20033L4.66666 4.00033ZM2.83333 3.74033C4.18 5.46699 6.66666 8.66699 6.66666 8.66699V12.667C6.66666 13.0337 6.96666 13.3337 7.33333 13.3337H8.66666C9.03333 13.3337 9.33333 13.0337 9.33333 12.667V8.66699C9.33333 8.66699 11.8133 5.46699 13.16 3.74033C13.5 3.30033 13.1867 2.66699 12.6333 2.66699H3.36C2.80666 2.66699 2.49333 3.30033 2.83333 3.74033Z" />
    </g>
    <defs>
      <clipPath id={`${id}-clip0_77_80253`}>
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
