import { FC } from 'react';

import { IconProps } from '@shared/types';

export const FeedbackIcon: FC<IconProps> = ({ className, id, ...props }) => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <path
      d="M2 7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6.703a4 4 0 0 1-4 4H8.059a4 4 0 0 0-2.707 1.054L4.25 19.771a.329.329 0 0 1-.47-.026v0A7.235 7.235 0 0 1 2 14.995V7Z"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="#8B90A0"
    />
    <path
      d="m6.18 10.88 1.5 1.5 2.5-3m6.915 2.914-2.829-2.828m0 2.828 2.828-2.828"
      strokeWidth={1.5}
      stroke="#8B90A0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
