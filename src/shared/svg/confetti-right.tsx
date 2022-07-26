import { FC } from 'react';

import { useSvgHelper } from '@shared/hooks';

export const ConfettiRightSvg: FC = props => {
  const { getId, getUrl } = useSvgHelper('Confetti-right');

  return (
    <svg width={64} height={80} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m20 49.676 2.386-1.47c.837-.505 1.28-1.436 1.203-2.416L23.324 43l1.47 2.386c.505.837 1.436 1.28 2.416 1.203l2.79-.265-2.386 1.47c-.837.505-1.28 1.436-1.203 2.416l.265 2.79-1.47-2.386c-.505-.837-1.436-1.28-2.416-1.203l-2.79.265Z"
        fill={getUrl('a')}
      />
      <path d="M40.269 64.454a3.696 3.696 0 1 0 5.835-4.537 3.696 3.696 0 0 0-5.835 4.537Z" fill={getUrl('b')} />
      <path
        d="m18.271 6.89 5.378.295c1.874.123 3.593-.86 4.547-2.492L30.838 0l-.296 5.378c-.122 1.874.861 3.593 2.493 4.546l4.693 2.643-5.378-.296c-1.874-.123-3.593.861-4.547 2.492l-2.642 4.693.296-5.377c.122-1.874-.861-3.594-2.493-4.547l-4.692-2.643Z"
        fill={getUrl('c')}
      />
      <path
        d="M43.415 45.974 42 42.52c2.343-2.4 5.222-3.58 8.585-3.566L52 42.408c-3.575-.508-6.428.686-8.585 3.566Z"
        fill={getUrl('d')}
      />
      <path
        d="m42.177 25.944-1.248 1.54c-.44.532-.518 1.257-.237 1.893l.83 1.8-1.54-1.248c-.532-.44-1.257-.517-1.893-.236l-1.8.83 1.248-1.54c.44-.533.517-1.258.237-1.894l-.83-1.8 1.54 1.248c.532.44 1.257.518 1.893.237l1.8-.83Z"
        fill={getUrl('e')}
      />
      <defs>
        <linearGradient id={getId('a')} x1={23.326} y1={43.009} x2={26.676} y2={53.002} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id={getId('b')} x1={40.888} y1={59.252} x2={45.453} y2={65.122} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id={getId('c')} x1={30.832} y1={0.016} x2={25.159} y2={19.46} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id={getId('d')} x1={43.165} y1={40.382} x2={50.831} y2={44.568} gradientUnits="userSpaceOnUse">
          <stop stopColor="#1373E4" />
          <stop offset={0.062} stopColor="#2163E3" />
          <stop offset={0.18} stopColor="#374AE2" />
          <stop offset={0.312} stopColor="#4736E1" />
          <stop offset={0.464} stopColor="#5328E0" />
          <stop offset={0.654} stopColor="#5A20E0" />
          <stop offset={1} stopColor="#5C1EE0" />
        </linearGradient>
        <linearGradient id={getId('e')} x1={41.519} y1={31.172} x2={36.943} y2={25.288} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
      </defs>
    </svg>
  );
};
