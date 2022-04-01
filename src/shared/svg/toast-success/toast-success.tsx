import { FC } from 'react';

import { IconProps } from '@shared/types';

export const ToastSuccess: FC<IconProps> = ({ className }) => {
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
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
        fill="currentColor"
      />
      <path d="M17.99 9L16.58 7.58L9.98999 14.17L7.40999 11.6L5.98999 13.01L9.98999 17L17.99 9Z" fill="currentColor" />
    </svg>
  );
};
