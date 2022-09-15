import { FC } from 'react';

import { useSvgHelper } from '@shared/hooks';
import { IconProps } from '@shared/types';

export const TempleIconLight: FC<IconProps> = ({ className, ...props }) => {
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
      <path d="M14.308 5.538h-.924l-.461-1.846.693-.923.692 2.769Z" fill={getUrl('l')} />
      <defs>
        <linearGradient id={getId('a')} x1={3.434} y1={0.702} x2={6.822} y2={24.215} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F96C13" />
          <stop offset={1} stopColor="#FB9828" />
        </linearGradient>
        <linearGradient id={getId('b')} x1={0.001} y1={11.998} x2={16.617} y2={11.998} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F84200" />
          <stop offset={1} stopColor="#F96C13" />
        </linearGradient>
        <linearGradient id={getId('c')} x1={12.045} y1={22.827} x2={8.033} y2={0.548} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F96C13" />
          <stop offset={1} stopColor="#FB9828" />
        </linearGradient>
        <linearGradient id={getId('d')} x1={1.743} y1={11.999} x2={14.154} y2={11.999} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F84200" />
          <stop offset={1} stopColor="#F96C13" />
        </linearGradient>
        <linearGradient id={getId('e')} x1={16.617} y1={12.001} x2={0.001} y2={12.001} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB9828" />
          <stop offset={1} stopColor="#F96C13" />
        </linearGradient>
        <linearGradient id={getId('f')} x1={0} y1={12.001} x2={16.615} y2={12.001} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F84200" />
          <stop offset={1} stopColor="#F96C13" />
        </linearGradient>
        <linearGradient id={getId('g')} x1={11.72} y1={24.882} x2={7.273} y2={0.186} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F96C13" />
          <stop offset={1} stopColor="#FB9828" />
        </linearGradient>
        <linearGradient id={getId('h')} x1={12.045} y1={22.827} x2={8.033} y2={0.548} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB9828" />
          <stop offset={1} stopColor="#F96C13" />
        </linearGradient>
        <linearGradient id={getId('i')} x1={0} y1={12} x2={16.616} y2={12} gradientUnits="userSpaceOnUse">
          <stop offset={0.002} stopColor="#FCC33C" />
          <stop offset={1} stopColor="#FFEE50" />
        </linearGradient>
        <linearGradient id={getId('j')} x1={16.616} y1={12.001} x2={0} y2={12.001} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F84200" />
          <stop offset={1} stopColor="#F96C13" />
        </linearGradient>
        <linearGradient id={getId('k')} x1={14.106} y1={24} x2={11.576} y2={-0.92} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F96C13" />
          <stop offset={1} stopColor="#F84200" />
        </linearGradient>
        <linearGradient id={getId('l')} x1={13.943} y1={5.928} x2={13.252} y2={3.159} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F84200" />
          <stop offset={1} stopColor="#F96C13" />
        </linearGradient>
      </defs>
    </svg>
  );
};
