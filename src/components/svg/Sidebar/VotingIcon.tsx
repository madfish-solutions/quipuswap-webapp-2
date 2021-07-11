import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const VotingIcon: React.FC<IconProps> = ({
  className,
  active,
}) => {
  const { themeColors, inactiveIconColor } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.9999 14V17C19.9999 19.2091 18.2091 21 15.9999 21H10.0216C8.7504 21 7.55488 20.3958 6.80098 19.3722L3.34536 14.6808C2.81503 13.9608 2.94773 12.9505 3.646 12.3919C4.35751 11.8227 5.3833 11.8799 6.02717 12.5246L7.99995 14.5V13H8.00388L7.99995 11L8.0174 6.5C8.0174 5.67157 8.68897 5 9.5174 5C10.3458 5 11.0174 5.67157 11.0174 6.5V11V4.5C11.0174 3.67157 11.689 3 12.5174 3C13.3458 3 14.0174 3.67157 14.0174 4.5V11V5.5C14.0174 4.67157 14.689 4 15.5174 4C16.3458 4 17.0174 4.67157 17.0174 5.5V11V7.5C17.0174 6.67157 17.689 6 18.5174 6C19.3458 6 20.0174 6.67157 20.0174 7.5L20.0058 14H19.9999Z"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
