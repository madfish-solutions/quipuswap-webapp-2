import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const GithubIcon: FC<IconProps> = ({ id, className }) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9633 0C5.3578 0 0 5.50719 0 12.2969C0 17.7286 3.44954 22.3305 8.14679 23.9902C8.73394 24.0657 8.95413 23.6885 8.95413 23.3867C8.95413 23.0849 8.95413 22.3305 8.95413 21.2744C5.65138 22.0288 4.91743 19.6147 4.91743 19.6147C4.40367 18.1813 3.59633 17.8041 3.59633 17.8041C2.49541 17.0497 3.66972 17.0497 3.66972 17.0497C4.84404 17.1251 5.50459 18.3322 5.50459 18.3322C6.6055 20.2182 8.29358 19.6901 8.95413 19.3883C9.02752 18.5585 9.3945 18.0304 9.68807 17.7286C7.04587 17.4269 4.25688 16.3707 4.25688 11.6179C4.25688 10.26 4.69725 9.2038 5.50459 8.29851C5.43119 8.07219 4.99083 6.78969 5.65138 5.12999C5.65138 5.12999 6.6789 4.82822 8.95413 6.41249C9.90826 6.11072 10.9358 6.03528 11.9633 6.03528C12.9908 6.03528 14.0183 6.18616 14.9725 6.41249C17.2477 4.82822 18.2752 5.12999 18.2752 5.12999C18.9358 6.78969 18.4954 8.07219 18.422 8.37395C19.156 9.2038 19.6697 10.3354 19.6697 11.6934C19.6697 16.4461 16.8807 17.4269 14.2385 17.7286C14.6789 18.1058 15.0459 18.8603 15.0459 19.9919C15.0459 21.6516 15.0459 22.9341 15.0459 23.3867C15.0459 23.6885 15.2661 24.0657 15.8532 23.9902C20.6239 22.3305 24 17.7286 24 12.2969C23.9266 5.50719 18.5688 0 11.9633 0Z"
        fill={`url(#GithubIcon-${id}paint0_linear)`}
      />
      <defs>
        <linearGradient
          id={`GithubIcon-${id}paint0_linear`}
          x1="0"
          y1="0"
          x2="26.8441"
          y2="3.77496"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
