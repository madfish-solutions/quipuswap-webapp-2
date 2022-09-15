import { FC } from 'react';

import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

export const TempleIconDark: FC<IconProps> = ({ className, ...props }) => {
  const { getId, getUrl } = useSvgHelper('temple-icon-light');

  return (
    <svg width={17} height={24} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M1.847 9.23 0 1.846 1.847 0l1.846 7.385L1.847 9.23Z" fill={getUrl('a')} />
      <path d="M10.154 18.461H7.847L6 20.308h2.308l1.846-1.847Z" fill={getUrl('b')} />
      <path d="m11.078 22.154-.924-3.693-1.846 1.847L9.231 24l1.847-1.846Z" fill={getUrl('c')} />
      <path d="m14.77 22.154-.74.738h-.922l.739-.738h-2.77L9.232 24h5.539l1.846-1.846H14.77Z" fill={getUrl('d')} />
      <path d="M14.77 9.23h-1.386l-.461-1.845h3.692L14.77 9.23Z" fill={getUrl('e')} />
      <path d="M5.539 9.23H1.847l1.846-1.845h3.692L5.54 9.23Z" fill={getUrl('f')} />
      <path d="M9.23 14.77H6.925L5.539 9.23l1.846-1.845 1.846 7.384Z" fill={getUrl('g')} />
      <path d="m7.847 18.461-.923-3.692-1.847 1.846L6 20.308l1.847-1.847Z" fill={getUrl('h')} />
      <path
        d="M12.923 7.385h3.692L14.77 0H1.847l1.846 7.385h3.692l1.846 7.384H6.924l.923 3.692h2.307l.924 3.693h5.538l-3.693-14.77Z"
        fill={getUrl('i')}
      />
      <path d="M12.923 3.692H4.616l-.231-.923h9.231l-.693.923Z" fill={getUrl('j')} />
      <path d="M14.77 22.154 10.616 5.538l-.74.738 3.971 15.878-.74.738h.924l.739-.738Z" fill={getUrl('k')} />
      <path d="M14.308 5.538h-.924l-.461-1.846.693-.923.692 2.769Z" fill="#4643FA" />
      <defs>
        <linearGradient id={getId('a')} x1={5.5} y1={0} x2={8.5} y2={21.5} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('b')} x1={7.5} y1={18} x2={8} y2={22.5} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('c')} x1={8} y1={16.5} x2={12} y2={24.5} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('d')} x1={5.5} y1={20.5} x2={13.357} y2={15.721} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('e')} x1={0} y1={0} x2={18.774} y2={1.828} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('f')} x1={3} y1={7.5} x2={17.5} y2={14} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('g')} x1={6.5} y1={1.5} x2={15} y2={23} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('h')} x1={5.5} y1={1} x2={18.608} y2={7.019} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('i')} x1={0} y1={0} x2={18.774} y2={1.828} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id={getId('j')} x1={14.5} y1={0} x2={-2} y2={0.5} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
        <linearGradient id={getId('k')} x1={11} y1={4} x2={14} y2={23} gradientUnits="userSpaceOnUse">
          <stop stopColor="#5C1EE0" />
          <stop offset={1} stopColor="#1373E4" />
        </linearGradient>
      </defs>
    </svg>
  );
};
