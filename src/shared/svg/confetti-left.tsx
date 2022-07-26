import { FC } from 'react';

import { useSvgHelper } from '@shared/hooks';

export const ConfettiLeftSvg: FC = props => {
  const { getId, getUrl } = useSvgHelper('ConfettiSvg');

  return (
    <svg width={64} height={80} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m56.986 24.023 2.976-.39c.741-2.591.416-5.07-.934-7.412l-2.975.39c1.78 2.292 2.084 4.759.934 7.412Z"
        fill={getUrl('a')}
      />
      <path d="M49.636 43.511a4 4 0 1 1-7.84-1.591 4 4 0 0 1 7.84 1.591Z" fill={getUrl('b')} />
      <path
        d="m19.659 57.477 1.767 5.563c5.218.531 9.854-.942 13.875-4.33l-1.768-5.564c-3.78 4.193-8.398 5.622-13.875 4.33Z"
        fill={getUrl('c')}
      />
      <path
        d="m42.338 9.77-2.89 1.109c-1.012.376-1.683 1.296-1.8 2.376l-.283 3.083-1.109-2.89c-.376-1.012-1.296-1.683-2.376-1.8l-3.083-.283 2.89-1.109c1.013-.376 1.683-1.296 1.8-2.376l.283-3.083 1.109 2.89c.376 1.013 1.296 1.683 2.376 1.8l3.083.283Z"
        fill={getUrl('d')}
      />
      <path d="M11.892 31.79a2 2 0 1 1 3.58 1.784 2 2 0 0 1-3.58-1.784Z" fill={getUrl('e')} />
      <defs>
        <linearGradient id={getId('a')} x1={60.988} y1={21.968} x2={55.012} y2={18.287} gradientUnits="userSpaceOnUse">
          <stop stopColor="#1373E4" />
          <stop offset={0.062} stopColor="#2163E3" />
          <stop offset={0.18} stopColor="#374AE2" />
          <stop offset={0.312} stopColor="#4736E1" />
          <stop offset={0.464} stopColor="#5328E0" />
          <stop offset={0.654} stopColor="#5A20E0" />
          <stop offset={1} stopColor="#5C1EE0" />
        </linearGradient>
        <linearGradient id={getId('b')} x1={46.531} y1={38.765} x2={44.931} y2={46.653} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id={getId('c')} x1={24.967} y1={64.435} x2={29.965} y2={51.726} gradientUnits="userSpaceOnUse">
          <stop stopColor="#1373E4" />
          <stop offset={0.062} stopColor="#2163E3" />
          <stop offset={0.18} stopColor="#374AE2" />
          <stop offset={0.312} stopColor="#4736E1" />
          <stop offset={0.464} stopColor="#5328E0" />
          <stop offset={0.654} stopColor="#5A20E0" />
          <stop offset={1} stopColor="#5C1EE0" />
        </linearGradient>
        <linearGradient id={getId('d')} x1={37.365} y1={16.328} x2={35.771} y2={4.795} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id={getId('e')} x1={12.777} y1={34.484} x2={14.57} y2={30.882} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
      </defs>
    </svg>
  );
};
