import { FC } from 'react';

import { IconProps } from '@shared/types';

export const MoreIcon: FC<IconProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11 12.0002C11 11.448 11.4477 11.0002 12 11.0002C12.5523 11.0002 13 11.448 13 12.0002C13 12.5525 12.5523 13.0002 12 13.0002C11.4477 13.0002 11 12.5525 11 12.0002ZM11 6.00024C11 5.44796 11.4477 5.00024 12 5.00024C12.5523 5.00024 13 5.44796 13 6.00024C13 6.55253 12.5523 7.00024 12 7.00024C11.4477 7.00024 11 6.55253 11 6.00024ZM11 18.0002C11 17.448 11.4477 17.0002 12 17.0002C12.5523 17.0002 13 17.448 13 18.0002C13 18.5525 12.5523 19.0002 12 19.0002C11.4477 19.0002 11 18.5525 11 18.0002Z"
        stroke="#8B90A0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
