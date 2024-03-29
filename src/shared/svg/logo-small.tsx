import { FC, useContext } from 'react';

import { ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const LogoSmall: FC<IconProps> = ({ className }) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M43.9439 74.0333C27.3373 74.0333 13.8335 60.5378 13.8335 43.9416C13.8335 27.3453 27.3373 13.8499 43.9439 13.8499C60.5505 13.8499 74.0543 27.3453 74.0543 43.9416C74.0543 45.8138 73.8787 47.6665 73.547 49.4412L83.6748 59.5627C85.5872 54.7262 86.641 49.4412 86.641 43.9416C86.641 20.4221 67.4976 1.27106 43.9439 1.27106C20.3903 1.27106 1.24683 20.4221 1.24683 43.9416C1.24683 67.4806 20.4098 86.6121 43.9439 86.6121C49.3689 86.6121 54.5401 85.598 59.3211 83.7453L49.1542 73.5847C47.4565 73.8968 45.7197 74.0333 43.9439 74.0333Z"
        fill={themeColors.fillLogo}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M76.0308 73.7928L60.5843 58.335C58.7533 56.4856 58.2858 53.7989 59.2013 51.5406C59.513 50.7814 59.9805 50.0611 60.5843 49.4575C63.0386 47.0045 67.0122 47.0045 69.4665 49.4575L84.9131 64.9153C87.3674 67.3683 87.3674 71.3398 84.9131 73.7928C84.504 74.2016 84.056 74.5326 83.5885 74.8051C81.1927 76.1679 78.0761 75.8369 76.0308 73.7928ZM58.0151 60.2234L73.8122 76.0121C76.2665 78.4651 76.2665 82.4366 73.8122 84.8896C73.4226 85.2789 73.0136 85.5904 72.5656 85.863C70.1502 87.2842 66.9947 86.9532 64.93 84.8896L49.4834 69.4318C47.0291 66.9789 47.0291 63.0073 49.4834 60.5544C50.2431 59.7951 51.1586 59.2694 52.113 58.9774C54.0999 58.3739 56.3399 58.7827 58.0151 60.2234Z"
        fill="url(#LogoSmall-paint0_linear)"
      />
      <defs>
        <linearGradient
          id="LogoSmall-paint0_linear"
          x1="47.6427"
          y1="47.6178"
          x2="91.3887"
          y2="53.7696"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
