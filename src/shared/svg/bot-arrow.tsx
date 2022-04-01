import { FC } from 'react';

import { IconProps } from '@shared/types';

export const BotArrow: FC<IconProps> = ({ className }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M3 6L8 11L13 6H3Z" fill="#A1A4B1" />
    </svg>
  );
};
