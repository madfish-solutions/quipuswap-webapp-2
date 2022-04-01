import { FC } from 'react';

import { IconProps } from '@shared/types';

export const DangerIcon: FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clip-rule="evenodd"
        d="M8.82075 1.8868L10 0L11.1792 1.8868L18.75 14L20 16H17.6415H2.35849H0L1.25 14L8.82075 1.8868ZM3.6085 14L10 3.77359L16.3915 14H3.6085ZM9 13H11V11H9V13ZM9 10H11V6H9V10Z"
        fill="#EA2424"
      />
    </svg>
  );
};
