import { FC } from 'react';

import { useSvgHelper } from '@shared/hooks';

export const ConfettiLeftSvg: FC = props => {
  const { getId, getUrl } = useSvgHelper('ConfettiSvg');

  return (
    <svg width={64} height={80} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m35.44 20.667-2.773 1.146c-.046 2.696.91 5.006 2.82 6.918l2.772-1.146c-2.311-1.754-3.244-4.058-2.82-6.918Z"
        fill={getUrl('a')}
      />
      <path d="M35.215 52.434a6.121 6.121 0 1 1-11.997-2.435 6.121 6.121 0 0 1 11.997 2.435Z" fill={getUrl('b')} />
      <path
        d="M52.808 65.425 50.1 60.253c-5.23.383-9.54 2.638-12.912 6.674l2.706 5.172c2.994-4.786 7.295-6.995 12.913-6.674Z"
        fill={getUrl('c')}
      />
      <path
        d="m63.339 5.77-2.891 1.11c-1.012.376-1.682 1.296-1.8 2.376l-.283 3.083-1.108-2.89c-.376-1.012-1.296-1.683-2.376-1.8l-3.083-.283 2.89-1.109c1.012-.376 1.683-1.296 1.8-2.376L56.77.797l1.108 2.89c.377 1.013 1.297 1.683 2.377 1.8l3.083.283Z"
        fill={getUrl('d')}
      />
      <path d="M58.608 38.217a3.06 3.06 0 1 1-5.998-1.218 3.06 3.06 0 0 1 5.998 1.218Z" fill="url(#e)" />
      <defs>
        <linearGradient id={getId('a')} x1={32.106} y1={23.687} x2={38.831} y2={25.696} gradientUnits="userSpaceOnUse">
          <stop stopColor="#1373E4" />
          <stop offset={0.062} stopColor="#2163E3" />
          <stop offset={0.18} stopColor="#374AE2" />
          <stop offset={0.312} stopColor="#4736E1" />
          <stop offset={0.464} stopColor="#5328E0" />
          <stop offset={0.654} stopColor="#5A20E0" />
          <stop offset={1} stopColor="#5C1EE0" />
        </linearGradient>
        <linearGradient id={getId('b')} x1={30.465} y1={45.171} x2={28.016} y2={57.241} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id={getId('c')} x1={46.372} y1={59.494} x2={43.656} y2={72.878} gradientUnits="userSpaceOnUse">
          <stop stopColor="#1373E4" />
          <stop offset={0.062} stopColor="#2163E3" />
          <stop offset={0.18} stopColor="#374AE2" />
          <stop offset={0.312} stopColor="#4736E1" />
          <stop offset={0.464} stopColor="#5328E0" />
          <stop offset={0.654} stopColor="#5A20E0" />
          <stop offset={1} stopColor="#5C1EE0" />
        </linearGradient>
        <linearGradient id={getId('d')} x1={58.365} y1={12.328} x2={56.771} y2={0.795} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id={getId('e')} x1={56.233} y1={34.586} x2={55.009} y2={40.62} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
      </defs>
    </svg>
  );
};
