import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const CoinSideBIcon: FC<IconProps> = ({ className, size, ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSideBIcon');

  return (
    <svg
      id={getId('Layer_1')}
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      width={size}
      height={size}
      viewBox="0 0 700 700"
      style={{
        // @ts-ignore
        enableBackground: 'new 0 0 700 700'
      }}
      xmlSpace="preserve"
      className={className}
      {...props}
    >
      <style>
        {
          '.st1{opacity:.71}.st2{fill:#101a23}.st3{fill:#768b91}.st4{opacity:.51}.st6{fill:#41535b}.st7{opacity:.08}.st8{fill:#fff}'
        }
      </style>
      <circle
        cx={349.92}
        cy={350.25}
        r={350}
        style={{
          fill: '#1c2e3a'
        }}
      />
      <g className="st1">
        <circle className="st2" cx={347.36} cy={345.5} r={295.11} />
      </g>
      <g className="st1">
        <circle className="st2" cx={347.6} cy={345.5} r={295.11} />
      </g>
      <path d="M353.5 433.87c-52.66 0-95.51-42.85-95.51-95.51 0-52.66 42.85-95.51 95.51-95.51 52.66 0 95.51 42.85 95.51 95.51 0 4.95-.38 9.81-1.11 14.55-.09.56-4.13-3.96-4.22-3.4l3.73 6.32 32.11 32.11c6.07-15.36 9.4-32.09 9.4-49.58 0-74.67-60.74-135.41-135.41-135.41S218.09 263.7 218.09 338.37c0 74.67 60.75 135.41 135.41 135.41 17.17 0 33.61-3.22 48.74-9.08l-3.73-6.32-28.52-25.93c-5.35.93-10.86 1.42-16.49 1.42z" />
      <path d="m406.35 384.07 49.06 49.15c6.5 6.5 16.37 7.57 23.99 3.22 1.51-.86 2.93-1.93 4.22-3.22 7.79-7.79 7.79-20.42 0-28.21l-49.06-49.15c-7.79-7.79-20.42-7.79-28.21 0a19.943 19.943 0 0 0 0 28.21zm42.01 56.2-50.18-50.18a19.955 19.955 0 0 0-18.77-3.96c-3.05.92-5.92 2.58-8.33 4.99-7.79 7.79-7.79 20.42 0 28.21l49.06 49.15c6.57 6.57 16.59 7.6 24.24 3.08a19.98 19.98 0 0 0 3.97-3.08c7.8-7.78 7.8-20.41.01-28.21z" />
      <path
        className="st3"
        d="M349.78 427.55c-52.66 0-95.51-42.85-95.51-95.51 0-52.66 42.85-95.51 95.51-95.51 52.66 0 95.51 42.85 95.51 95.51 0 5.97-.56 11.81-1.61 17.47l32.11 32.11c6.07-15.36 9.4-32.09 9.4-49.58 0-74.67-60.74-135.41-135.41-135.41s-135.41 60.75-135.41 135.41c0 74.67 60.75 135.41 135.41 135.41 17.18 0 33.61-3.22 48.74-9.08l-32.25-32.25c-5.36.94-10.87 1.43-16.49 1.43z"
      />
      <path
        className="st3"
        d="m402.62 377.75 49.06 49.15c6.5 6.5 16.37 7.57 23.99 3.22 1.51-.86 2.93-1.93 4.22-3.22 7.79-7.79 7.79-20.42 0-28.21l-49.06-49.15c-7.79-7.79-20.42-7.79-28.21 0-1.95 1.95-3.41 4.2-4.38 6.6-2.92 7.2-1.46 15.76 4.38 21.61zm42.01 56.2-50.18-50.18a19.955 19.955 0 0 0-18.77-3.96c-3.05.92-5.92 2.58-8.33 4.99-7.79 7.79-7.79 20.42 0 28.21l49.06 49.15c6.57 6.57 16.59 7.6 24.24 3.08a19.98 19.98 0 0 0 3.97-3.08c7.8-7.78 7.8-20.41.01-28.21z"
      />
      <path
        d="M82.51 357.65c0-162.98 132.12-295.11 295.11-295.11 29.25 0 57.5 4.28 84.18 12.2-35.47-15.1-74.49-23.45-115.47-23.45-162.98 0-295.11 132.12-295.11 295.11 0 133.73 88.96 246.67 210.93 282.9-105.6-44.94-179.64-149.65-179.64-271.65z"
        style={{
          fill: '#0d161c'
        }}
        className="st4"
      />
      <path d="m448.41 543.5 6.6 12.63a4.085 4.085 0 0 0 5.52 1.73c1.53-.8 2.35-2.44 2.17-4.06-.05-.5-.81-3.9-1.06-4.38l-5.98-9.72a4.1 4.1 0 0 0-5.53-1.73c-.5.26-2.56-2.03-2.9-1.61-1 1.23.4 5.64 1.18 7.14zm4.11 10.43-6.08-9.74a4.104 4.104 0 0 0-3.43-1.93c-.65-.01-3.51-2.26-4.13-1.93-2 1.05-.58 5.92.47 7.92l6.6 12.63a4.087 4.087 0 0 0 5.53 1.73 4.09 4.09 0 0 0 2.11-4.46c-.09-.37-.89-3.88-1.07-4.22zm122.24-178.22 14.05 2.41a4.085 4.085 0 0 0 4.72-3.35c.14-.82-.89-5.42-1.2-6.13-.53-1.22-.73 1.64-2.15 1.4l-14.05-2.41c-2.23-.38-5.4-2.01-5.78.22-.1.56.99 4.24 1.11 4.75a4.115 4.115 0 0 0 3.3 3.11z" />
      <path d="m588.46 380.13-14.36-2.45c-1.43-.13-2.78.49-3.61 1.56-.4.52-1.72-1.77-1.84-1.08-.09.51 1.06 4.38 1.06 4.38a4.09 4.09 0 0 0 3.33 3.24l14.05 2.41a4.093 4.093 0 0 0 4.72-3.35c.13-.74-.95-5.46-1.2-6.12-.49-1.3-.66 1.67-2.15 1.41zm-3.86-41.57c-2.18 0-3.96 1.74-4 3.91-.09 5.18-.35 10.32-.77 15.41-.08.93-.16 1.86-.25 2.79-.09.95-1.58 1.38-1.58 1.38l1 4 7.91 1.36c.32-2.71.6-5.43.84-8.16.47-5.5.76-11.03.85-16.6.02-1.41 0-5.46-1.69-6.32-.69-.36-1.48 2.23-2.31 2.23zm-34.44 135.35-11.94-8.35a4.1 4.1 0 0 0-3.93-.13c-.58.29-3.08-1.48-3.08-1.48-.46 1.49.02 3.67.98 6.18.37.86.79 1.73 1.61 2.31l11.67 8.18c1.56 1.09 3.62.94 5.01-.24a4.095 4.095 0 0 0 1.4-2.62c.08-.68-.96-5.24-1.21-5.87-.29-.73.17 2.5-.51 2.02z" />
      <path d="m527.93 480.83 11.67 8.18c1.55 1.08 3.58.94 4.96-.21.27-.23.52-.5.74-.8.45-.64.69-1.37.73-2.09.08-1.38-.9-6.22-2.11-7.07l-11.3-4.72a4.091 4.091 0 0 0-5.7 1.01c-.32.46-1.62-2-1.73-1.48-.2.93 1.02 4.87 1.45 5.71.29.57.72 1.08 1.29 1.47zm47.28-92.32c-.59 2.67-1.22 5.33-1.9 7.97-5.76 22.33-14.78 43.37-26.5 62.58-.79 1.3-1.59 2.58-2.41 3.86-.32.5-2.98-.94-2.98-.94l1 4 6.68 4.68c1.51-2.28 2.98-4.59 4.4-6.91a237.518 237.518 0 0 0 27.78-65.91c.67-2.65 1.3-5.31 1.88-7.98l-1-4-3.16 3.29-3.79-.64z" />
      <path d="M529.12 484.18c-1.72 2.13-3.48 4.23-5.27 6.29a233.647 233.647 0 0 1-57.34 47.87c-1.74 1.03-3.5 2.05-5.27 3.04-.3.17-2.85-2.98-2.85-2.98l1 4 3.78 7.23c2.4-1.31 4.77-2.65 7.13-4.04 17.31-10.21 33.44-22.68 48.03-37.26 4.26-4.26 8.33-8.65 12.22-13.17 1.79-2.08 3.55-4.18 5.26-6.31l-1-4-5.69-.67zm-97.64 71.12c-7.78 2.99-15.77 5.58-23.93 7.72-1.77.46-3.93.74-3.93.74 0 .73 1.12 4.62 1.45 5.2a4 4 0 0 0 4.49 1.88 238.96 238.96 0 0 0 25.7-8.29c2.56-.99 5.1-2.02 7.62-3.1l-1-4-2.79-3.24a201.76 201.76 0 0 1-7.61 3.09z" />
      <path
        className="st6"
        d="m447.41 539.5 6.6 12.63a4.085 4.085 0 0 0 5.52 1.73 4.1 4.1 0 0 0 1.73-5.53l-6.6-12.63a4.1 4.1 0 0 0-5.53-1.73c-.5.26-.93.61-1.26 1.02-1 1.24-1.24 3.01-.46 4.51zm4.79 13.58-6.75-12.9a4.104 4.104 0 0 0-3.43-1.93c-.65-.01-1.32.14-1.94.47a4.1 4.1 0 0 0-1.73 5.53l6.6 12.63a4.087 4.087 0 0 0 5.53 1.73c1.99-1.05 2.76-3.52 1.72-5.53zm121.56-181.37 14.05 2.41a4.085 4.085 0 0 0 4.72-3.35 4.09 4.09 0 0 0-3.35-4.72l-14.05-2.41a4.09 4.09 0 0 0-4.72 3.35c-.1.56-.07 1.11.05 1.63a4.12 4.12 0 0 0 3.3 3.09zm13.7 4.42-14.36-2.45c-1.43-.13-2.78.49-3.61 1.56a4.09 4.09 0 0 0 2.55 6.54l14.05 2.41a4.093 4.093 0 0 0 4.72-3.35c.38-2.21-1.12-4.33-3.35-4.71zm-3.86-41.57c-2.18 0-3.96 1.74-4 3.91-.09 5.18-.35 10.32-.77 15.41-.23 2.74-.5 5.46-.82 8.17l7.91 1.36c.32-2.71.6-5.43.84-8.16.47-5.5.76-11.03.85-16.6.03-2.25-1.77-4.09-4.01-4.09zm-34.44 135.35-11.94-8.35a4.1 4.1 0 0 0-3.93-.13c-.58.29-1.1.73-1.5 1.31a4.091 4.091 0 0 0 1.01 5.7l11.67 8.18c1.56 1.09 3.62.94 5.01-.24.26-.22.49-.48.69-.76 1.29-1.86.84-4.42-1.01-5.71zm-22.23 6.92 11.67 8.18c1.55 1.08 3.58.94 4.96-.21.27-.23.52-.5.74-.8 1.3-1.85.84-4.41-1.01-5.7l-11.67-8.18a4.091 4.091 0 0 0-5.7 1.01c-.32.46-.54.97-.65 1.49-.33 1.56.27 3.24 1.66 4.21zm47.28-92.32c-.59 2.67-1.22 5.33-1.9 7.97-5.76 22.33-14.78 43.37-26.5 62.58-1.42 2.33-2.89 4.64-4.39 6.92l6.68 4.68c1.51-2.28 2.98-4.59 4.4-6.91a237.518 237.518 0 0 0 27.78-65.91c.67-2.65 1.3-5.31 1.88-7.98l-7.95-1.35zm-46.09 95.67c-1.72 2.13-3.48 4.23-5.27 6.29a233.647 233.647 0 0 1-57.34 47.87c-2.35 1.39-4.72 2.74-7.12 4.05l3.78 7.23c2.4-1.31 4.77-2.65 7.13-4.04 17.31-10.21 33.44-22.68 48.03-37.26 4.26-4.26 8.33-8.65 12.22-13.17 1.79-2.08 3.55-4.18 5.26-6.31l-6.69-4.66zm-97.64 71.12c-7.78 2.99-15.77 5.58-23.93 7.72a4.008 4.008 0 0 0-3.01 3.87v.07c0 2.62 2.48 4.54 5.02 3.88a238.96 238.96 0 0 0 25.7-8.29c2.56-.99 5.1-2.02 7.62-3.1l-3.79-7.24a201.76 201.76 0 0 1-7.61 3.09z"
      />
      <path d="m251.42 543.5-6.6 12.63a4.085 4.085 0 0 1-5.52 1.73 4.087 4.087 0 0 1-1.88-5.2c.05-.11.7-3.06.75-3.17l.43.88 5.57-10.67a4.1 4.1 0 0 1 5.53-1.73c.5.26.93.61 1.26 1.02.25.31.46.65.61 1.01.18.42 1.24-2.21 1.27-1.76.03.46-.97 4.01-1.1 4.46-.08.28-.19.55-.32.8zm-4.78 13.58.61-2.89 6.14-10.01a4.104 4.104 0 0 1 3.43-1.93c.65-.01 1.32.14 1.94.47.89.46 1.53 1.2 1.88 2.06.15.37 1.24-2.31 1.28-1.91.06.58-1 4.27-1.2 4.85-.06.18-.14.36-.23.53l-6.6 12.63a4.087 4.087 0 0 1-5.53 1.73c-2-1.05-2.77-3.52-1.72-5.53zM125.07 375.71l-14.05 2.41a4.085 4.085 0 0 1-4.72-3.35c-.09-.5-.08-1 .02-1.47.09-.48.72-3.43.97-3.84.59-.98 1.14.8 2.36.59l14.05-2.41c2.23-.38 5.36-1.61 5.74.61.1.56-1.07 4.36-1.07 4.36a4.117 4.117 0 0 1-3.3 3.1z" />
      <path d="m111.37 380.13 14.36-2.45c1.43-.13 2.78.49 3.61 1.56.4.52 1.72-1.69 1.83-1.01.17.99-1.06 4.79-1.54 5.59-.59 1-1.6 1.75-2.84 1.96l-14.05 2.41a4.093 4.093 0 0 1-4.72-3.35c-.08-.47-.08-.94 0-1.39.09-.54.94-4.35 1.23-4.8.6-.92.93 1.68 2.12 1.48zm3.87-41.57c2.18 0 3.96 1.74 4 3.91.09 5.18.35 10.32.77 15.41.14 1.69 1.65 2.48 1.82 4.17l-1 4-7.91 1.36c-.32-2.71-.6-5.43-.84-8.16-.47-5.5-.85-11.03-.85-16.6 0-2.35.83-5.01 1.34-5.69.73-1 1.35 1.6 2.67 1.6zm34.43 135.35 11.94-8.35a4.1 4.1 0 0 1 3.93-.13c.58.29 1.1.73 1.5 1.31.43.61 1.68-1.81 1.74-1.12.05.58-1.04 4.27-1.23 4.82a4.07 4.07 0 0 1-1.52 2l-11.67 8.18a4.112 4.112 0 0 1-5.01-.24 4.105 4.105 0 0 1-1.43-3.28c.03-.63.96-4.74 1.27-5.29.3-.55-.05 2.47.48 2.1z" />
      <path d="m171.91 480.83-11.67 8.18a4.094 4.094 0 0 1-4.96-.21c-.27-.23-.52-.5-.74-.8a4.1 4.1 0 0 1-.71-2.81c.06-.51 1.01-4.56 1.25-5.02.29-.56-.08 2.51.47 2.12l11.67-8.18c1.85-1.3 4.41-.84 5.7 1.01.32.46 1.61-1.77 1.72-1.25.11.54-.95 3.83-1.05 4.37-.2 1.01-.77 1.95-1.68 2.59zm-47.28-92.32c.59 2.67 1.22 5.33 1.9 7.97 5.76 22.33 14.78 43.37 26.5 62.58 1.16 1.9 4.18 1.06 5.39 2.92l-1 4-6.68 4.68c-1.51-2.28-2.98-4.59-4.4-6.91a237.518 237.518 0 0 1-27.78-65.91c-.67-2.65-1.3-5.31-1.88-7.98l1-4 3.1 3.3 3.85-.65z" />
      <path d="M170.72 484.18c1.72 2.13 3.48 4.23 5.27 6.29a233.647 233.647 0 0 0 57.34 47.87c1.78 1.05 3.57 2.08 5.37 3.09.33.18 2.75-3.04 2.75-3.04l-1 4-3.78 7.23c-2.4-1.31-4.77-2.65-7.13-4.04-17.31-10.21-33.44-22.68-48.03-37.26-4.26-4.26-8.33-8.65-12.22-13.17-1.79-2.08-3.55-4.18-5.26-6.31l1-4 3.34.97 2.35-1.63zm97.63 71.12c7.78 2.99 15.77 5.58 23.93 7.72 1.77.46 4.01-1.88 4.01-.06l-.84 4.01c-.49 2.52-2.64 4.53-5.18 3.87a238.96 238.96 0 0 1-25.7-8.29c-2.56-.99-5.1-2.02-7.62-3.1l1-4 2.79-3.24c2.51 1.08 5.05 2.11 7.61 3.09z" />
      <path
        className="st6"
        d="m252.42 539.5-6.6 12.63a4.085 4.085 0 0 1-5.52 1.73 4.1 4.1 0 0 1-1.73-5.53l6.6-12.63a4.1 4.1 0 0 1 5.53-1.73c.5.26.93.61 1.26 1.02a4.11 4.11 0 0 1 .46 4.51zm-4.78 13.58 6.75-12.9a4.104 4.104 0 0 1 3.43-1.93c.65-.01 1.32.14 1.94.47a4.1 4.1 0 0 1 1.73 5.53l-6.6 12.63a4.087 4.087 0 0 1-5.53 1.73c-2-1.05-2.77-3.52-1.72-5.53zM126.07 371.71l-14.05 2.41a4.085 4.085 0 0 1-4.72-3.35 4.09 4.09 0 0 1 3.35-4.72l14.05-2.41a4.09 4.09 0 0 1 4.72 3.35c.1.56.07 1.11-.05 1.63a4.12 4.12 0 0 1-3.3 3.09zm-13.7 4.42 14.36-2.45c1.43-.13 2.78.49 3.61 1.56a4.09 4.09 0 0 1-2.55 6.54l-14.05 2.41a4.093 4.093 0 0 1-4.72-3.35c-.38-2.21 1.12-4.33 3.35-4.71zm3.87-41.57c2.18 0 3.96 1.74 4 3.91.09 5.18.35 10.32.77 15.41.23 2.74.5 5.46.82 8.17l-7.91 1.36c-.32-2.71-.6-5.43-.84-8.16-.47-5.5-.76-11.03-.85-16.6-.03-2.25 1.76-4.09 4.01-4.09zm34.43 135.35 11.94-8.35a4.1 4.1 0 0 1 3.93-.13c.58.29 1.1.73 1.5 1.31 1.3 1.85.84 4.41-1.01 5.7l-11.67 8.18a4.112 4.112 0 0 1-5.01-.24 4.16 4.16 0 0 1-.69-.76c-1.29-1.86-.84-4.42 1.01-5.71zm22.24 6.92-11.67 8.18a4.094 4.094 0 0 1-4.96-.21c-.27-.23-.52-.5-.74-.8a4.091 4.091 0 0 1 1.01-5.7l11.67-8.18c1.85-1.3 4.41-.84 5.7 1.01.32.46.54.97.65 1.49.33 1.56-.28 3.24-1.66 4.21zm-47.28-92.32c.59 2.67 1.22 5.33 1.9 7.97 5.76 22.33 14.78 43.37 26.5 62.58 1.42 2.33 2.89 4.64 4.39 6.92l-6.68 4.68c-1.51-2.28-2.98-4.59-4.4-6.91a237.518 237.518 0 0 1-27.78-65.91c-.67-2.65-1.3-5.31-1.88-7.98l7.95-1.35zm46.09 95.67c1.72 2.13 3.48 4.23 5.27 6.29a233.647 233.647 0 0 0 57.34 47.87c2.35 1.39 4.72 2.74 7.12 4.05l-3.78 7.23c-2.4-1.31-4.77-2.65-7.13-4.04-17.31-10.21-33.44-22.68-48.03-37.26-4.26-4.26-8.33-8.65-12.22-13.17-1.79-2.08-3.55-4.18-5.26-6.31l6.69-4.66zm97.63 71.12c7.78 2.99 15.77 5.58 23.93 7.72 1.77.46 3.01 2.05 3.01 3.87v.07c0 2.62-2.48 4.54-5.02 3.88a238.96 238.96 0 0 1-25.7-8.29c-2.56-.99-5.1-2.02-7.62-3.1l3.79-7.24c2.51 1.08 5.05 2.11 7.61 3.09z"
      />
      <path d="m349 139.02-1.64-3-.21-4.84a16.865 16.865 0 0 0-12.57-12.57l-7.84-1.84-1.64-3 9.48 1.16a16.865 16.865 0 0 0 12.57-12.57l.21-10.84 1.64 3 1.84 7.84a16.865 16.865 0 0 0 12.57 12.57l6.21-1.16 1.64 3-7.84 1.84a16.865 16.865 0 0 0-12.57 12.57l-1.85 7.84z" />
      <path
        className="st6"
        d="m347.36 136.02-1.84-7.84a16.865 16.865 0 0 0-12.57-12.57l-7.84-1.84 7.84-1.84a16.865 16.865 0 0 0 12.57-12.57l1.84-7.84 1.84 7.84a16.865 16.865 0 0 0 12.57 12.57l7.84 1.84-7.84 1.84a16.865 16.865 0 0 0-12.57 12.57l-1.84 7.84z"
      />
      <path d="m409 160.27-1.64-3-.21-4.84a16.865 16.865 0 0 0-12.57-12.57l-7.84-1.84-1.64-3 9.48 1.16a16.865 16.865 0 0 0 12.57-12.57l.21-10.84 1.64 3 1.84 7.84a16.865 16.865 0 0 0 12.57 12.57l6.02-1.2 1.82 3.04-7.84 1.84a16.865 16.865 0 0 0-12.57 12.57l-1.84 7.84z" />
      <path
        className="st6"
        d="m407.36 157.27-1.84-7.84a16.865 16.865 0 0 0-12.57-12.57l-7.84-1.84 7.84-1.84a16.865 16.865 0 0 0 12.57-12.57l1.84-7.84 1.84 7.84a16.865 16.865 0 0 0 12.57 12.57l7.84 1.84-7.84 1.84a16.865 16.865 0 0 0-12.57 12.57l-1.84 7.84z"
      />
      <path d="m289 160.27-1.64-3-.21-4.84a16.865 16.865 0 0 0-12.57-12.57l-7.84-1.84-1.64-3 9.48 1.16a16.865 16.865 0 0 0 12.57-12.57l.21-10.84 1.64 3 1.84 7.84a16.865 16.865 0 0 0 12.57 12.57l6.21-1.16 1.64 3-7.84 1.84a16.865 16.865 0 0 0-12.57 12.57l-1.85 7.84z" />
      <path
        className="st6"
        d="m287.36 157.27-1.84-7.84a16.865 16.865 0 0 0-12.57-12.57l-7.84-1.84 7.84-1.84a16.865 16.865 0 0 0 12.57-12.57l1.84-7.84 1.84 7.84a16.865 16.865 0 0 0 12.57 12.57l7.84 1.84-7.84 1.84a16.865 16.865 0 0 0-12.57 12.57l-1.84 7.84z"
      />
      <g className="st7">
        <path
          className="st8"
          d="m641.3 319.3 52.93-32.17a347.448 347.448 0 0 0-18.46-64.86l-48.52 29.49c7.21 21.51 11.99 44.14 14.05 67.54z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M59.07 408.73 11 437.95c2.75 10.67 6 21.15 9.71 31.4l47.23-28.7c-3.54-10.4-6.5-21.05-8.87-31.92z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m135.34 550.75-49 29.78a351.433 351.433 0 0 0 49.04 46.27l53.34-32.42a296.863 296.863 0 0 1-53.38-43.63z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M625.62 443.98c-40.55 114.56-149.81 196.63-278.25 196.63-13.79 0-27.36-.97-40.65-2.8l-71.23 43.3c35.86 12.4 74.36 19.14 114.43 19.14 176.04 0 321.73-129.97 346.33-299.2l-70.63 42.93z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m496.67 90.92 49.83-30.28c-24.87-16.91-52.03-30.71-80.92-40.82l-59.83 36.36c32.57 6.54 63.19 18.44 90.92 34.74z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m560.41 141.31 46.73-28.4a348.992 348.992 0 0 0-23.4-23.08l-47.55 28.9a293.86 293.86 0 0 1 24.22 22.58z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M52.25 345.5c0-28.23 3.97-55.53 11.37-81.38L3.4 300.73a353.194 353.194 0 0 0-3.48 49.52c0 13.92.82 27.65 2.4 41.14l50.33-30.59c-.26-5.06-.4-10.17-.4-15.3z"
        />
      </g>
      <path className="st8" d="m347.36 91.5-.04.2.08-.05z" />
      <g className="st7">
        <path
          className="st8"
          d="m332.95 111.91-7.84 1.84 7.84 1.84a16.865 16.865 0 0 1 12.57 12.57l1.84 7.84 1.84-7.84a16.865 16.865 0 0 1 12.57-12.57l7.84-1.84-7.84-1.84a16.865 16.865 0 0 1-12.57-12.57l-1.81-7.7-.08.05-1.8 7.65a16.838 16.838 0 0 1-12.56 12.57z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M421.78 133.17a16.865 16.865 0 0 1-12.57-12.57l-1.84-7.84-1.84 7.84a16.88 16.88 0 0 1-12.57 12.57l-7.84 1.84 7.84 1.84c5.34 1.26 9.67 5.01 11.73 9.98l9.04-5.49c1.88-1.87 4.2-3.3 6.8-4.13l5.15-3.13-3.9-.91z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m285.52 149.43 1.84 7.84 1.84-7.84a16.88 16.88 0 0 1 12.57-12.57l7.84-1.84-7.84-1.84c-4.39-1.03-8.1-3.76-10.43-7.46l-18.36 11.16a16.848 16.848 0 0 1 12.54 12.55z"
        />
      </g>
      <g className="st7">
        <path className="st8" d="m249.47 241.17 66.06-40.15c-25.82 6.76-48.65 20.95-66.06 40.15z" />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M458.51 554.24c.35-.08.69-.2 1.02-.37a4.1 4.1 0 0 0 1.73-5.53l-1.77-3.39-7.01 4.26 1.53 2.92a4.097 4.097 0 0 0 4.5 2.11zm-9.01 4.73c.33-.08.65-.2.97-.36a4.1 4.1 0 0 0 1.73-5.53l-1.47-2.8-7.01 4.26 1.22 2.34a4.099 4.099 0 0 0 4.56 2.09zm19.79-17.38a240.009 240.009 0 0 0 29.23-20.35l-37.27 22.65.91 1.74c2.4-1.31 4.77-2.65 7.13-4.04z"
        />
      </g>
      <path
        d="M591.12 96.64c59.73 62.78 96.39 147.71 96.39 241.2 0 193.3-156.7 350-350 350-93.49 0-178.42-36.66-241.2-96.39 63.76 67.02 153.81 108.8 253.61 108.8 193.3 0 350-156.7 350-350 0-99.81-41.78-189.85-108.8-253.61z"
        className="st4"
      />
      <path
        className="st8"
        d="M356.62 7.47c99.6 0 189.47 41.6 253.21 108.37C545.77 44.87 453.06.25 349.92.25c-193.3 0-350 156.7-350 350 0 93.7 36.82 178.81 96.79 241.63-56-62.05-90.09-144.24-90.09-234.4 0-193.31 156.7-350.01 350-350.01z"
        style={{
          opacity: 0.52
        }}
      />
      <linearGradient
        id={getId('SVGID_1_')}
        gradientUnits="userSpaceOnUse"
        x1={1346.555}
        y1={2143.996}
        x2={1456.865}
        y2={2143.996}
        gradientTransform="rotate(45.001 3041.28 106.076)"
      >
        <stop
          offset={0}
          style={{
            stopColor: '#f9a605'
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ff6b00'
          }}
        />
      </linearGradient>
      <path
        d="m401.94 377.21 49.49 49.58c6.56 6.56 16.52 7.64 24.2 3.25a20.22 20.22 0 0 0 4.26-3.25c7.86-7.86 7.86-20.6 0-28.46l-49.49-49.58c-7.86-7.86-20.6-7.86-28.46 0a20.032 20.032 0 0 0-4.42 6.66c-2.94 7.27-1.47 15.91 4.42 21.8z"
        style={{
          opacity: 0.77,
          fill: getUrl('SVGID_1_')
        }}
      />
      <linearGradient
        id={getId('SVGID_2_')}
        gradientUnits="userSpaceOnUse"
        x1={360.471}
        y1={423.352}
        x2={450.735}
        y2={423.352}
      >
        <stop
          offset={0}
          style={{
            stopColor: '#f9a605'
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#ff6b00'
          }}
        />
      </linearGradient>
      <path
        d="m444.32 433.91-50.62-50.62c-5.34-4.59-12.52-5.93-18.93-4-3.08.93-5.97 2.6-8.4 5.03-7.86 7.86-7.86 20.6 0 28.46l49.49 49.58c6.63 6.63 16.74 7.67 24.46 3.11 1.43-.84 2.78-1.88 4.01-3.11 7.85-7.85 7.85-20.59-.01-28.45z"
        style={{
          opacity: 0.77,
          fill: getUrl('SVGID_2_')
        }}
      />
      <linearGradient
        id={getId('SVGID_3_')}
        gradientUnits="userSpaceOnUse"
        x1={395.549}
        y1={387.772}
        x2={486.294}
        y2={387.772}
      >
        <stop
          offset={0}
          style={{
            stopColor: '#f9a605'
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#f36c21'
          }}
        />
      </linearGradient>
      <path
        d="m401.94 377.21 49.49 49.58c6.56 6.56 16.52 7.64 24.2 3.25a20.22 20.22 0 0 0 4.26-3.25c7.86-7.86 7.86-20.6 0-28.46l-49.49-49.58c-7.86-7.86-20.6-7.86-28.46 0a20.032 20.032 0 0 0-4.42 6.66c-2.94 7.27-1.47 15.91 4.42 21.8z"
        style={{
          opacity: 0.77,
          fill: 'none',
          stroke: getUrl('SVGID_3_'),
          strokeMiterlimit: 10
        }}
      />
      <linearGradient
        id={getId('SVGID_4_')}
        gradientUnits="userSpaceOnUse"
        x1={359.971}
        y1={423.352}
        x2={450.716}
        y2={423.352}
      >
        <stop
          offset={0}
          style={{
            stopColor: '#f9a605'
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#f36c21'
          }}
        />
      </linearGradient>
      <path
        d="m444.32 433.91-50.62-50.62c-5.34-4.59-12.52-5.93-18.93-4-3.08.93-5.97 2.6-8.4 5.03-7.86 7.86-7.86 20.6 0 28.46l49.49 49.58c6.63 6.63 16.74 7.67 24.46 3.11 1.43-.84 2.78-1.88 4.01-3.11 7.85-7.85 7.85-20.59-.01-28.45z"
        style={{
          opacity: 0.77,
          fill: 'none',
          stroke: getUrl('SVGID_4_'),
          strokeMiterlimit: 10
        }}
      />
      <path
        d="M399.52 357.41c.98-2.42 2.46-4.7 4.42-6.66 7.85-7.85 20.56-7.86 28.42-.03l-1.96-1.97c-7.86-7.86-20.6-7.86-28.46 0a20.032 20.032 0 0 0-4.42 6.66c-2.95 7.27-1.47 15.91 4.42 21.8l49.49 49.58.04.04-47.54-47.62c-5.88-5.89-7.35-14.53-4.41-21.8zm-31.15 28.92c2.43-2.43 5.33-4.11 8.4-5.03 6.41-1.93 13.59-.6 18.93 4l-2-2c-5.34-4.59-12.52-5.93-18.93-4-3.08.93-5.97 2.6-8.4 5.03-7.86 7.86-7.86 20.6 0 28.46l49.49 49.58.04.04-47.54-47.62c-7.85-7.86-7.85-20.6.01-28.46z"
        style={{
          opacity: 0.39,
          fill: '#fff'
        }}
      />
      <path
        d="m480.08 398.52-49.49-49.58c-.01-.01-.03-.02-.04-.03l47.53 47.62c7.86 7.86 7.86 20.6 0 28.46a20.22 20.22 0 0 1-4.26 3.25c-7.67 4.38-17.6 3.31-24.16-3.21l1.96 1.96c6.56 6.56 16.52 7.64 24.2 3.25a20.22 20.22 0 0 0 4.26-3.25c7.86-7.87 7.86-20.61 0-28.47zm-37.57 33.58c7.86 7.86 7.86 20.6 0 28.46a20.378 20.378 0 0 1-4.01 3.11c-7.7 4.55-17.78 3.52-24.41-3.07l1.96 1.96c6.63 6.63 16.74 7.67 24.46 3.11 1.43-.84 2.78-1.88 4.01-3.11 7.86-7.86 7.86-20.6 0-28.46l-2.01-2z"
        style={{
          opacity: 0.17
        }}
      />
      <path
        d="M367.35 384.8c2.41-2.41 5.28-4.07 8.33-4.99a19.96 19.96 0 0 1 18.77 3.96l5.9 5.9 8.82-5.36-6.55-6.56c-5.84-5.84-7.3-14.41-4.38-21.61.97-2.4 2.44-4.65 4.38-6.6 7.79-7.79 20.42-7.79 28.21 0l13.43 13.45 8.01-4.87-8.6-8.6c1.05-5.67 1.61-11.5 1.61-17.47 0-38.5-22.9-71.75-55.79-86.85l-135.11 82.12c-.08 1.57-.12 3.14-.12 4.73 0 49.03 37.14 89.54 84.76 94.9l26.48-16.09c-5.86-7.82-5.26-18.95 1.85-26.06zM269 281.13l72.82-44.26c-30.63 2.54-57.21 19.59-72.82 44.26z"
        style={{
          fill: 'none'
        }}
      />
      <g className="st7">
        <path
          className="st8"
          d="M349.78 236.53c14.17 0 27.62 3.1 39.72 8.66l38.67-23.5c-10.07-7.18-21.17-13-33.02-17.23l-53.32 32.41c2.62-.22 5.27-.34 7.95-.34z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m269 281.13-53.37 32.44a135.66 135.66 0 0 0-1.27 18.47c0 6.38.45 12.65 1.31 18.8l38.71-23.53A94.887 94.887 0 0 1 269 281.13z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m398.52 458.38-32.25-32.25a95.405 95.405 0 0 1-27.24.82l-46.06 28c17.29 8.02 36.53 12.51 56.81 12.51 17.17 0 33.6-3.23 48.74-9.08z"
        />
      </g>
      <g className="st7">
        <path className="st8" d="M475.79 381.63c5.35-13.55 8.57-28.17 9.26-43.43l-32.77 19.92 23.51 23.51z" />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m479.9 398.69-35.64-35.7-35.09 21.33 42.51 42.59c1.76 1.76 3.76 3.1 5.9 4.07l28.11-17.08c.3-5.48-1.62-11.04-5.79-15.21z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m400.35 389.67-35.7 21.18c.56.75 1.16 1.48 1.85 2.16l45.22 45.31 35.55-21.09c-.75-1.16-1.63-2.26-2.64-3.28l-44.28-44.28z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M583.6 334.56c-2.18 0-3.96 1.74-4 3.91-.09 5.18-.35 10.32-.77 15.41-.1 1.2-.21 2.4-.33 3.59l8.47-5.15c.33-4.54.55-9.1.62-13.68a3.99 3.99 0 0 0-3.99-4.08z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M250.69 533.98c-2-1.05-4.48-.27-5.53 1.73l-6.6 12.63c-1.05 2-.27 4.48 1.73 5.53a4.085 4.085 0 0 0 5.52-1.73l6.6-12.63c.79-1.5.55-3.27-.47-4.5-.32-.42-.75-.77-1.25-1.03z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M259.76 538.72c-.62-.32-1.28-.47-1.94-.47a4.08 4.08 0 0 0-3.43 1.93l-6.75 12.9c-.89 1.7-.46 3.72.9 4.94l8.43-5.12 4.52-8.65a4.1 4.1 0 0 0-1.73-5.53z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M129.37 368.61c.12-.52.14-1.07.05-1.63-.05-.3-.14-.59-.25-.86l-11.58 7.04 8.49-1.45a4.118 4.118 0 0 0 3.29-3.1z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="M109.02 380.86a4.093 4.093 0 0 0 4.72 3.35l14.05-2.41a4.09 4.09 0 0 0 2.55-6.54 4.085 4.085 0 0 0-3.61-1.56l-13.9 2.37-3.24 1.97c-.51.8-.74 1.79-.57 2.82z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m125.63 384.51-7.95 1.36a243.053 243.053 0 0 0 5.61 21.13l7.13-4.33c-1.04-3.36-2-6.76-2.89-10.18-.68-2.65-1.32-5.31-1.9-7.98z"
        />
      </g>
      <g className="st7">
        <path
          className="st8"
          d="m237.67 545.63 3.78-7.23c-2.4-1.31-4.77-2.66-7.12-4.05a234.402 234.402 0 0 1-33.02-23.69L194 515.1a240.8 240.8 0 0 0 36.54 26.5c2.36 1.38 4.74 2.72 7.13 4.03z"
        />
      </g>
      <g className="st7">
        <path className="st8" d="m261.74 548.22-1.37 2.61 3.11-1.89c-.58-.24-1.17-.47-1.74-.72z" />
      </g>
      <linearGradient
        id={getId('SVGID_5_')}
        gradientUnits="userSpaceOnUse"
        x1={442.92}
        y1={380.875}
        x2={412.963}
        y2={353.13}
      >
        <stop
          offset={0}
          style={{
            stopColor: '#fff',
            stopOpacity: 0
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#fff'
          }}
        />
      </linearGradient>
      <circle
        cx={415.33}
        cy={355.32}
        r={6.62}
        style={{
          opacity: 0.52,
          fill: getUrl('SVGID_5_')
        }}
      />
      <linearGradient
        id={getId('SVGID_6_')}
        gradientUnits="userSpaceOnUse"
        x1={431.093}
        y1={393.646}
        x2={401.135}
        y2={365.901}
      >
        <stop
          offset={0}
          style={{
            stopColor: '#fff',
            stopOpacity: 0
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#fff'
          }}
        />
      </linearGradient>
      <circle
        cx={412.52}
        cy={376.45}
        r={3.86}
        style={{
          opacity: 0.52,
          fill: getUrl('SVGID_6_')
        }}
      />
      <linearGradient
        id={getId('SVGID_7_')}
        gradientUnits="userSpaceOnUse"
        x1={397.433}
        y1={406.302}
        x2={372.411}
        y2={385.621}
      >
        <stop
          offset={0}
          style={{
            stopColor: '#fff',
            stopOpacity: 0
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#fff'
          }}
        />
      </linearGradient>
      <circle
        cx={379.07}
        cy={391.13}
        r={6.62}
        style={{
          opacity: 0.52,
          fill: getUrl('SVGID_7_')
        }}
      />
      <linearGradient
        id={getId('SVGID_8_')}
        gradientUnits="userSpaceOnUse"
        x1={385.671}
        y1={420.532}
        x2={360.65}
        y2={399.851}
      >
        <stop
          offset={0}
          style={{
            stopColor: '#fff',
            stopOpacity: 0
          }}
        />
        <stop
          offset={1}
          style={{
            stopColor: '#fff'
          }}
        />
      </linearGradient>
      <circle
        cx={375.65}
        cy={412.25}
        r={3.86}
        style={{
          opacity: 0.52,
          fill: getUrl('SVGID_8_')
        }}
      />
    </svg>
  );
};
