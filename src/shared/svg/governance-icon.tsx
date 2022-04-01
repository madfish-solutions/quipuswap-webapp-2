import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const GovernanceIcon: FC<IconProps> = ({ id, className }) => {
  const { themeColors } = useContext(ColorThemeContext);

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
        d="M11 7.99976L9.42229 7.21091C9.14458 7.07205 8.83835 6.99976 8.52786 6.99976H7.82843C7.29799 6.99976 6.78929 7.21047 6.41421 7.58555L5.58579 8.41397C5.21071 8.78905 5 9.29775 5 9.82819V14.9294C5 15.5981 5.3342 16.2226 5.8906 16.5935L9.75746 19.1714C10.4944 19.6628 11.4668 19.6108 12.1472 19.0438L17 14.9998"
        stroke={`url(#GovernanceIcon-${id}paint0_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4551 12.914C13.8517 12.106 12.7412 11.8737 11.8645 12.3719L10.0092 13.4264C9.41314 13.7651 8.66428 13.6639 8.17953 13.1792C7.54621 12.5458 7.5934 11.5054 8.28146 10.9321L12.4439 7.46332C12.8034 7.16379 13.2564 6.99976 13.7243 6.99976H14.5281C14.8386 6.99976 15.1448 7.07205 15.4225 7.21091L17.8946 8.44697C18.5722 8.78576 19.0002 9.47828 19.0002 10.2359V12.9794C19.0002 14.9035 16.5491 15.7178 15.3978 14.1762L14.4551 12.914Z"
        stroke={`url(#GovernanceIcon-${id}paint1_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 17.0002V8.00024"
        stroke={`url(#GovernanceIcon-${id}paint2_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 17.0002V8.00024"
        stroke={`url(#GovernanceIcon-${id}paint3_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={`GovernanceIcon-${id}paint0_linear`}
          x1="5"
          y1="6.99976"
          x2="18.4428"
          y2="8.81344"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`GovernanceIcon-${id}paint1_linear`}
          x1="7.7334"
          y1="6.99976"
          x2="20.0976"
          y2="9.45352"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`GovernanceIcon-${id}paint2_linear`}
          x1="23"
          y1="8.00024"
          x2="24.1403"
          y2="8.01806"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`GovernanceIcon-${id}paint3_linear`}
          x1="1"
          y1="8.00024"
          x2="2.14035"
          y2="8.01806"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
