import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';

export const VotingIcon: FC<IconProps> = ({ id, className }) => {
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
        d="M20 14V17C20 19.2091 18.2091 21 16 21H10.0217C8.75046 21 7.55494 20.3958 6.80104 19.3722L3.34542 14.6808C2.81509 13.9608 2.94779 12.9505 3.64606 12.3919C4.35757 11.8227 5.38336 11.8799 6.02723 12.5246L8.00001 14.5V13H8.00394L8.00001 11L8.01746 6.5C8.01746 5.67157 8.68903 5 9.51746 5C10.3459 5 11.0175 5.67157 11.0175 6.5V11V4.5C11.0175 3.67157 11.689 3 12.5175 3C13.3459 3 14.0175 3.67157 14.0175 4.5V11V5.5C14.0175 4.67157 14.689 4 15.5175 4C16.3459 4 17.0175 4.67157 17.0175 5.5V11V7.5C17.0175 6.67157 17.689 6 18.5175 6C19.3459 6 20.0175 6.67157 20.0175 7.5L20.0059 14H20Z"
        stroke={`url(#VotingIcon-${id}paint0_linear)`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={`VotingIcon-${id}paint0_linear`}
          x1="3.02075"
          y1="3"
          x2="22.0717"
          y2="5.52971"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
