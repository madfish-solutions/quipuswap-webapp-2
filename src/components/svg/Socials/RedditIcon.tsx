import React, { useContext } from 'react';

import { ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';

export const RedditIcon: React.FC<IconProps> = ({
  id,
  className,
}) => {
  const { themeColors } = useContext(ColorThemeContext);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0 12C0 5.37211 5.37211 0 12 0C18.6279 0 24 5.37211 24 12C24 18.6279 18.6279 24 12 24C5.37211 24 0 18.6279 0 12ZM19.5436 13.9418C19.5436 13.7599 19.5287 13.5839 19.5019 13.4079C20.1074 13.0708 20.4802 12.4295 20.4773 11.7465C20.4743 10.6846 19.6152 9.8255 18.5563 9.8255C18.0761 9.82252 17.6107 10.0045 17.2558 10.3326C15.9881 9.50634 14.2908 8.97539 12.4116 8.90082L13.4497 5.73602L16.173 6.37733C16.176 7.24832 16.8829 7.95526 17.7539 7.95526C18.6279 7.95526 19.3348 7.24832 19.3348 6.37435C19.3348 5.50037 18.6279 4.79344 17.7539 4.79344C17.1186 4.79344 16.5459 5.17226 16.2983 5.75391L13.3125 5.04996L13.3065 5.04698L13.0261 4.98136L11.7465 8.88889C9.79567 8.92468 8.02983 9.45563 6.71439 10.2998C6.3654 9.98956 5.91499 9.81656 5.44072 9.81656C4.37882 9.81954 3.51976 10.6786 3.51976 11.7375C3.51976 12.4027 3.86577 13.0231 4.43251 13.3721C4.3997 13.557 4.38479 13.7479 4.38479 13.9418C4.38479 16.7308 7.78523 18.9978 11.9642 18.9978C16.1432 18.9978 19.5436 16.7308 19.5436 13.9418ZM11.9993 16.5608C13.091 16.5608 13.8397 16.343 14.2842 15.8986C14.4065 15.7763 14.6093 15.7763 14.7316 15.8986C14.8539 16.0209 14.8539 16.2237 14.7316 16.346C14.1619 16.9157 13.267 17.1931 11.9993 17.1931C10.7316 17.1931 9.83677 16.9157 9.26705 16.346C9.14177 16.2237 9.14475 16.0209 9.26705 15.8986C9.38935 15.7733 9.59218 15.7763 9.71447 15.8986C10.1589 16.343 10.9076 16.5608 11.9993 16.5608ZM14.5687 11.833C13.9244 11.833 13.3815 12.3729 13.3815 13.0202C13.3815 13.6644 13.9244 14.1894 14.5687 14.1894C15.213 14.1894 15.7379 13.6674 15.7379 13.0202C15.7379 12.3759 15.213 11.833 14.5687 11.833ZM9.44989 11.833C10.0972 11.833 10.6192 12.3759 10.6192 13.0202C10.6192 13.6644 10.0942 14.1894 9.44989 14.1894C8.80262 14.1894 8.26272 13.6644 8.26272 13.0202C8.26272 12.3759 8.80262 11.833 9.44989 11.833Z" fill={`url(#RedditIcon-${id}paint0_linear)`} />
      <defs>
        <linearGradient id={`RedditIcon-${id}paint0_linear`} x1="0" y1="0" x2="26.8441" y2="3.77496" gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset="1" stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
