import { FC } from 'react';

//TODO: gradient icon

export const NavStakeIcon: FC = props => (
  <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m5 14 8-11v7h5l-8 11v-7H5Z"
      stroke="#8B90A0"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
