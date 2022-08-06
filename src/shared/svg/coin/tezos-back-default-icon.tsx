import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const TezosBackDefaultIcon: FC<IconProps> = ({ ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSideBQuipuIconNew');

  return (
    <svg fill="none" viewBox="0 0 145 145" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath={getUrl('a')}>
        <path
          d="M71.008 135c35.346 0 64-28.654 64-64 0-35.346-28.654-64-64-64-35.346 0-64 28.654-64 64 0 35.346 28.654 64 64 64Z"
          fill="#FCBF12"
        />
        <path
          d="M70.582 124.094c29.803 0 53.963-24.16 53.963-53.963S100.385 16.17 70.582 16.17 16.62 40.329 16.62 70.13c0 29.803 24.16 53.963 53.963 53.963Z"
          fill="#F9A605"
        />
        <path
          opacity={0.29}
          d="M22.232 72.165c0-29.802 24.16-53.963 53.963-53.963 5.349 0 10.515.782 15.393 2.23a53.771 53.771 0 0 0-21.114-4.287c-29.802 0-53.963 24.159-53.963 53.963 0 24.453 16.267 45.105 38.57 51.73-19.31-8.218-32.849-27.365-32.849-49.673Z"
          fill="#0D161C"
        />
        <path
          opacity={0.3}
          d="M115.113 24.626c10.922 11.48 17.626 27.01 17.626 44.105 0 35.346-28.654 64-64 64-17.095 0-32.625-6.704-44.105-17.626C36.29 127.36 52.757 135 71.008 135c35.346 0 64-28.654 64-64 0-18.251-7.64-34.715-19.895-46.374Z"
          fill="#000"
        />
        <path
          opacity={0.52}
          d="M72.218 8.32c18.213 0 34.646 7.607 46.302 19.817C106.808 15.159 89.853 7 70.993 7c-35.346 0-64 28.654-64 64 0 17.134 6.733 32.697 17.699 44.184-10.24-11.347-16.474-26.376-16.474-42.862 0-35.348 28.654-64.002 64-64.002Z"
          fill="#fff"
        />
        <path
          d="M36.157 62.86v-5.262H58.81v5.261h-8.127V84.4h-6.385V62.86h-8.14ZM61.991 84.4V57.6H80.68v5.261H68.47v5.497h11.256v5.273H68.47v5.51h12.21v5.26H61.99V84.4Zm22.653 0v-3.69l13.02-17.85H84.657v-5.262h21.201v3.69L92.836 79.14h13.008v5.26h-21.2Z"
          fill="#F9C23A"
        />
        <path
          opacity={0.3}
          d="m36.157 62.86 1.829 1.828h6.312v-1.829h-8.14Zm22.654 0h-8.128V84.4h-6.385l1.828 1.828h6.386v-21.54h8.128v-5.26L58.81 57.6v5.26Zm21.866 0h-12.21v5.496h1.83v-3.668h12.209v-5.26L80.677 57.6v5.26ZM68.468 73.631v5.51h1.828V75.46h11.255v-5.276l-1.828-1.828v5.275H68.468ZM61.991 84.4l1.829 1.828h18.686V80.97l-1.829-1.828V84.4H61.991Zm22.665-21.54 1.829 1.828h9.845l1.335-1.829H84.656Zm23.03-3.431-1.829-1.829v3.69L92.836 79.14h3.162l11.688-16.021v-3.69ZM84.644 84.4l1.828 1.828h21.201V80.97l-1.829-1.828V84.4h-21.2Z"
          fill="#000"
        />
        <path
          d="m70.58 25.287-3.454 3.455 3.455 3.455 3.455-3.455-3.455-3.455Zm11.37 7.931-3.455 3.455 3.455 3.455 3.455-3.455-3.455-3.455Zm-22.741 0-3.455 3.455 3.455 3.455 3.455-3.455-3.455-3.455Zm14.828 78.277-3.455-3.455-3.455 3.455 3.455 3.455 3.455-3.455Zm11.37-7.931-3.455-3.455-3.455 3.455 3.455 3.455 3.455-3.455Zm-22.741 0-3.455-3.455-3.455 3.455 3.455 3.454 3.455-3.454Z"
          fill="#FCBF12"
        />
        <path
          opacity={0.3}
          d="m74.035 28.744-3.455 3.455 1.098 1.097 3.455-3.455-1.098-1.097Zm11.371 7.929-3.455 3.455 1.098 1.097 3.455-3.455-1.098-1.097Zm-22.741.001-3.455 3.455 1.098 1.097 3.455-3.454-1.098-1.098ZM74.035 111.497l-3.455 3.455 1.098 1.098 3.455-3.455-1.098-1.098Zm11.371-7.931-3.455 3.455 1.098 1.098 3.455-3.455-1.098-1.098Zm-22.741 0-3.455 3.455 1.098 1.098 3.455-3.455-1.098-1.098Z"
          fill="#000"
        />
      </g>
      <defs>
        <clipPath id={getId('a')}>
          <path fill="#fff" transform="translate(7 7)" d="M0 0h128v128H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};