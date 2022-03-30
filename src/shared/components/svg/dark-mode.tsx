import { FC } from 'react';

import { IconProps } from './icon.props';

export const DarkMode: FC<IconProps> = ({ id, className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M8.45558 5.96235C8.81381 5.75117 9.21959 6.09711 9.16491 6.50934C9.12164 6.83559 9.1 7.16659 9.1 7.5C9.1 11.58 12.42 14.9 16.5 14.9C16.8334 14.9 17.1644 14.8784 17.4907 14.8351C17.9029 14.7804 18.2488 15.1862 18.0376 15.5444C16.8197 17.6105 14.5672 19 12 19C8.14 19 5 15.86 5 12C5 9.43279 6.38953 7.18033 8.45558 5.96235ZM12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 11.9645 20.9998 11.929 20.9993 11.8936C20.9933 11.4412 20.3971 11.2722 20.0564 11.5699C19.1075 12.3989 17.8657 12.9 16.5 12.9C13.52 12.9 11.1 10.48 11.1 7.5C11.1 6.14148 11.6014 4.89563 12.4308 3.94427C12.7281 3.60321 12.5588 3.00666 12.1064 3.0007C12.071 3.00024 12.0355 3 12 3Z"
      fill={`url(#DarkMode-${id}paint0_linear)`}
    />
    <defs>
      <linearGradient
        id={`DarkMode-${id}paint0_linear`}
        x1="3"
        y1="3"
        x2="23.1331"
        y2="5.83122"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF6B00" />
        <stop offset="1" stopColor="#F9A605" />
      </linearGradient>
    </defs>
  </svg>
);
