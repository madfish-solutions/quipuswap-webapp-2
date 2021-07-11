import React, { useContext } from 'react';

import { ColorThemeContext } from '@providers/ColorThemeContext';

export const GovernanceIcon: React.FC<IconProps> = ({
  className,
  active,
}) => {
  const { themeColors, inactiveIconColor } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 7.99976L9.42229 7.21091C9.14458 7.07205 8.83835 6.99976 8.52786 6.99976H7.82843C7.29799 6.99976 6.78929 7.21047 6.41421 7.58555L5.58579 8.41397C5.21071 8.78905 5 9.29775 5 9.82819V14.9294C5 15.5981 5.3342 16.2226 5.8906 16.5935L9.75746 19.1714C10.4944 19.6628 11.4668 19.6108 12.1472 19.0438L17 14.9998"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4549 12.914C13.8515 12.106 12.741 11.8737 11.8643 12.3719L10.009 13.4264C9.41302 13.7651 8.66416 13.6639 8.17941 13.1792C7.54609 12.5458 7.59328 11.5054 8.28134 10.9321L12.4437 7.46332C12.8032 7.16379 13.2562 6.99976 13.7241 6.99976H14.5279C14.8384 6.99976 15.1446 7.07205 15.4223 7.21091L17.8944 8.44697C18.572 8.78576 19 9.47828 19 10.2359V12.9794C19 14.9035 16.5489 15.7178 15.3976 14.1762L14.4549 12.914Z"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 17.0002V8.00024"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 17.0002V8.00024"
        stroke={active ? themeColors.fill1 : inactiveIconColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
