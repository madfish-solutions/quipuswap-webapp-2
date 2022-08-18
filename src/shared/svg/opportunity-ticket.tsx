import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const OpportunityTicket: FC<IconProps> = ({ className }) => {
  const { themeColors, colorThemeMode } = useContext(ColorThemeContext);

  return (
    <svg
      className={className}
      width={576}
      height={104}
      viewBox="0 0 576 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M404 0a8 8 0 0 1-16 0H12c0 6.627-5.373 12-12 12v8a4 4 0 0 1 0 8v6a4 4 0 0 1 0 8v6a4 4 0 0 1 0 8v6a4 4 0 0 1 0 8v6a4 4 0 0 1 0 8v8c6.627 0 12 5.373 12 12h376a8 8 0 0 1 16 0h160c0-6.627 5.373-12 12-12v-8a4 4 0 0 1 0-8v-6a4 4 0 0 1 0-8v-6a4 4 0 0 1 0-8v-6a4 4 0 0 1 0-8v-6a4 4 0 0 1 0-8v-8c-6.627 0-12-5.373-12-12H404Z"
        fill={colorThemeMode === ColorModes.Dark ? themeColors.background1 : themeColors.stroke}
      />
      <path
        d="M396 10.5c4.938 0 9.079-3.408 10.2-8h155.515A14.513 14.513 0 0 0 573.5 14.285v3.713a6.502 6.502 0 0 0 0 12.004v1.996a6.502 6.502 0 0 0 0 12.004v1.996a6.502 6.502 0 0 0 0 12.004v1.996a6.502 6.502 0 0 0 0 12.004v1.996a6.502 6.502 0 0 0 0 12.004v3.713a14.513 14.513 0 0 0-11.785 11.785H406.2c-1.121-4.592-5.262-8-10.2-8s-9.079 3.408-10.2 8H14.285A14.513 14.513 0 0 0 2.5 89.715v-3.713a6.502 6.502 0 0 0 0-12.004v-1.996a6.502 6.502 0 0 0 0-12.004v-1.996a6.502 6.502 0 0 0 0-12.004v-1.996a6.502 6.502 0 0 0 0-12.004v-1.996a6.502 6.502 0 0 0 0-12.004v-3.713A14.513 14.513 0 0 0 14.285 2.5H385.8c1.121 4.592 5.262 8 10.2 8Z"
        stroke="url(#a)"
      />
      <path
        d="m200.27 79.78-3.377-2.047c.482-3.515 2.187-6.329 5.055-8.433l3.376 2.047c-3.358 1.818-5.032 4.627-5.054 8.433Z"
        fill="url(#b)"
      />
      <path
        d="m332.927 60.52 5.172-2.707c-.383-5.23-2.639-9.54-6.674-12.912l-5.172 2.707c4.786 2.994 6.995 7.295 6.674 12.912Z"
        fill="url(#c)"
      />
      <path
        d="m365.731 67.439-1.147-2.773c-2.695-.045-5.005.91-6.918 2.82l1.147 2.773c1.754-2.312 4.057-3.244 6.918-2.82Z"
        fill="url(#d)"
      />
      <path d="M45.673 84.828a3.696 3.696 0 1 0-1.012-7.322 3.696 3.696 0 0 0 1.012 7.322Z" fill="url(#e)" />
      <path d="M355.999 33.215a6.122 6.122 0 1 1 2.436-11.999 6.122 6.122 0 0 1-2.436 12Z" fill="url(#f)" />
      <path d="M304.999 80.608a3.06 3.06 0 1 1 1.217-5.998A3.06 3.06 0 0 1 305 80.608Z" fill="url(#g)" />
      <path
        d="m30.915 39.635-1.944-5.069c-.66-1.774-2.273-2.95-4.167-3.155l-5.406-.496 5.069-1.944c1.774-.66 2.95-2.273 3.155-4.167l.496-5.406 1.944 5.069c.66 1.774 2.273 2.95 4.167 3.155l5.406.496-5.069 1.944c-1.774.66-2.95 2.273-3.155 4.167l-.496 5.406Z"
        fill="url(#h)"
      />
      <path
        d="m303.365 21.338-1.109-2.89c-.376-1.012-1.296-1.683-2.376-1.8l-3.083-.283 2.891-1.109c1.012-.376 1.682-1.296 1.799-2.376l.283-3.083 1.109 2.89c.376 1.013 1.296 1.683 2.376 1.8l3.083.283-2.89 1.109c-1.012.376-1.683 1.296-1.8 2.376l-.283 3.083Z"
        fill="url(#i)"
      />
      <path
        d="m253.249 89.563-.082-2.845c-.018-.992-.612-1.854-1.513-2.285l-2.589-1.184 2.846-.082c.992-.018 1.854-.612 2.284-1.513l1.185-2.589.081 2.846c.019.992.613 1.854 1.514 2.284l2.588 1.184-2.845.082c-.992.019-1.854.613-2.285 1.514l-1.184 2.588Z"
        fill="url(#j)"
      />
      <circle cx={396} cy={24} r={3} fill={themeColors.background2} />
      <circle cx={396} cy={80} r={3} fill={themeColors.background2} />
      <circle cx={396} cy={38} r={3} fill={themeColors.background2} />
      <circle cx={396} cy={66} r={3} fill={themeColors.background2} />
      <circle cx={396} cy={52} r={3} fill={themeColors.background2} />
      <circle cx={396} cy={24} r={4.5} stroke="url(#l)" />
      <circle cx={396} cy={80} r={4.5} stroke="url(#m)" />
      <circle cx={396} cy={38} r={4.5} stroke="url(#n)" />
      <circle cx={396} cy={66} r={4.5} stroke="url(#o)" />
      <circle cx={396} cy={52} r={4.5} stroke="url(#p)" />
      <defs>
        <linearGradient id="a" x1={2} y1={2} x2={398.132} y2={320.639} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="b" x1={196.54} y1={75.183} x2={205.69} y2={73.919} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill2} />
          <stop offset={0.062} stopColor="#2163E3" />
          <stop offset={0.18} stopColor="#374AE2" />
          <stop offset={0.312} stopColor="#4736E1" />
          <stop offset={0.464} stopColor="#5328E0" />
          <stop offset={0.654} stopColor="#5A20E0" />
          <stop offset={1} stopColor="#5C1EE0" />
        </linearGradient>
        <linearGradient id="c" x1={338.858} y1={54.084} x2={325.474} y2={51.368} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill2} />
          <stop offset={0.062} stopColor="#2163E3" />
          <stop offset={0.18} stopColor="#374AE2" />
          <stop offset={0.312} stopColor="#4736E1" />
          <stop offset={0.464} stopColor="#5328E0" />
          <stop offset={0.654} stopColor="#5A20E0" />
          <stop offset={1} stopColor="#5C1EE0" />
        </linearGradient>
        <linearGradient id="d" x1={362.71} y1={64.105} x2={360.702} y2={70.831} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill2} />
          <stop offset={0.062} stopColor="#2163E3" />
          <stop offset={0.18} stopColor="#374AE2" />
          <stop offset={0.312} stopColor="#4736E1" />
          <stop offset={0.464} stopColor="#5328E0" />
          <stop offset={0.654} stopColor="#5A20E0" />
          <stop offset={1} stopColor="#5C1EE0" />
        </linearGradient>
        <linearGradient id="e" x1={41.477} y1={81.69} x2={48.843} y2={80.672} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id="f" x1={363.262} y1={28.465} x2={351.192} y2={26.016} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id="g" x1={308.631} y1={78.232} x2={302.596} y2={77.008} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id="h" x1={19.416} y1={30.914} x2={39.639} y2={28.119} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id="i" x1={296.807} y1={16.365} x2={308.34} y2={14.771} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id="j" x1={249.074} y1={83.252} x2={259.565} y2={85.381} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id="k" x1={195} y1={24} x2={286.59} y2={61.834} gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset={1} stopColor="#F9A605" />
        </linearGradient>
        <linearGradient id="l" x1={391} y1={19} x2={402.185} y2={20.573} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="m" x1={391} y1={75} x2={402.185} y2={76.573} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="n" x1={391} y1={33} x2={402.185} y2={34.573} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="o" x1={391} y1={61} x2={402.185} y2={62.573} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
        <linearGradient id="p" x1={391} y1={47} x2={402.185} y2={48.573} gradientUnits="userSpaceOnUse">
          <stop stopColor={themeColors.fill1} />
          <stop offset={1} stopColor={themeColors.fill2} />
        </linearGradient>
      </defs>
    </svg>
  );
};
