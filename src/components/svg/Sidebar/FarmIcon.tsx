import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const FarmIcon: React.FC<IconProps> = ({ id, className }) => {
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
        d="M3 16.9998V16.9998C2.42439 16.9998 1.93455 16.5805 1.84568 16.0118L0.890279 9.89772C0.806726 9.36302 1.07863 8.83568 1.56269 8.59366V8.59366C1.98392 8.38304 2.25 7.95251 2.25 7.48156V4.5C2.25 3.67157 2.92157 3 3.75 3H9.22183C9.95837 3 10.5859 3.53476 10.7028 4.26198L12.75 16.9998H10.5"
        stroke={`url(#FarmIcon-${id}paint0_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.5 9H11.25"
        stroke={`url(#FarmIcon-${id}paint1_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 17H20.6109C21.3947 17 22.0464 16.3965 22.1065 15.6151L22.3912 11.9144C22.4522 11.1208 21.8828 10.4177 21.0939 10.3125L11.25 9L12.75 17H16"
        stroke={`url(#FarmIcon-${id}paint2_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 19.5C8.82107 19.5 10.5 17.8211 10.5 15.75C10.5 13.6789 8.82107 12 6.75 12C4.67893 12 3 13.6789 3 15.75C3 17.8211 4.67893 19.5 6.75 19.5Z"
        stroke={`url(#FarmIcon-${id}paint3_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 19C19.1046 19 20 18.1046 20 17C20 15.8954 19.1046 15 18 15C16.8954 15 16 15.8954 16 17C16 18.1046 16.8954 19 18 19Z"
        stroke={`url(#FarmIcon-${id}paint4_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={`FarmIcon-${id}paint0_linear`}
          x1="0.75"
          y1="3"
          x2="14.2415"
          y2="4.62623"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`FarmIcon-${id}paint1_linear`}
          x1="1.5"
          y1="9"
          x2="5.36163"
          y2="14.2947"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`FarmIcon-${id}paint2_linear`}
          x1="11.25"
          y1="9"
          x2="23.5991"
          y2="11.4421"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`FarmIcon-${id}paint3_linear`}
          x1="3"
          y1="12"
          x2="11.3888"
          y2="13.1797"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient
          id={`FarmIcon-${id}paint4_linear`}
          x1="16"
          y1="15"
          x2="20.474"
          y2="15.6292"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
