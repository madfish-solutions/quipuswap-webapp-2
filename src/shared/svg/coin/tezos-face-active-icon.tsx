import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const TezosFaceActiveIcon: FC<IconProps> = ({ ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSideBQuipuIconNew');

  return (
    <svg width={160} height={160} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter={getUrl('a')}>
        <path
          d="M80 144c35.346 0 64-28.654 64-64 0-35.346-28.654-64-64-64-35.346 0-64 28.654-64 64 0 35.346 28.654 64 64 64Z"
          fill="#FCBF12"
        />
        <path
          d="M79.576 133.094c29.803 0 53.963-24.16 53.963-53.963S109.379 25.17 79.576 25.17 25.613 49.329 25.613 79.13c0 29.803 24.16 53.963 53.963 53.963Z"
          fill="#DB9605"
        />
        <g filter={getUrl('b')}>
          <path
            d="M86.03 109.508c-4.331 0-7.493-1.044-9.486-3.131a9.663 9.663 0 0 1-2.979-6.745 4.484 4.484 0 0 1 .522-2.23c.34-.592.83-1.084 1.422-1.424a4.97 4.97 0 0 1 4.43 0c.591.338 1.08.83 1.416 1.425a4.39 4.39 0 0 1 .541 2.228 4.27 4.27 0 0 1-.758 2.61 3.541 3.541 0 0 1-1.803 1.32 4.917 4.917 0 0 0 2.845 1.774 14.12 14.12 0 0 0 3.88.559 8.64 8.64 0 0 0 4.886-1.461 8.528 8.528 0 0 0 3.187-4.315 18.76 18.76 0 0 0 1.044-6.46 17.693 17.693 0 0 0-1.139-6.717 8.282 8.282 0 0 0-3.291-4.173 8.756 8.756 0 0 0-4.742-1.356 9.001 9.001 0 0 0-4.107 1.395l-3.046 1.527v-1.527l13.687-18.363H73.567v19.054a6.823 6.823 0 0 0 1.044 3.899 3.598 3.598 0 0 0 3.188 1.526 5.328 5.328 0 0 0 3.148-1.11 11.367 11.367 0 0 0 2.637-2.713.954.954 0 0 1 .344-.455.696.696 0 0 1 .457-.17c.33.029.642.162.892.378.317.355.49.814.483 1.29-.037.32-.093.635-.17.948a9.187 9.187 0 0 1-3.253 4.04 8.074 8.074 0 0 1-4.564 1.386c-4.107 0-6.952-.81-8.536-2.429a9.098 9.098 0 0 1-2.353-6.64V64.445h-9.65v-3.54h9.696v-8.073l-2.22-2.222V48.8h6.44l2.419 1.253v10.85l25.06-.076 2.495 2.503-15.368 15.44a10.38 10.38 0 0 1 2.902-.702 12.58 12.58 0 0 1 5.618 1.604 11.53 11.53 0 0 1 4.838 4.317 15.248 15.248 0 0 1 2.182 5.208c.325 1.464.501 2.958.521 4.458a18.626 18.626 0 0 1-1.896 8.261 12.116 12.116 0 0 1-5.693 5.693 18.388 18.388 0 0 1-8.197 1.898Z"
            fill="#FF0"
          />
        </g>
        <path
          d="m122.648 79.45-3.455-3.454-3.454 3.454 3.454 3.455 3.455-3.455ZM84.744 35.83l-3.455-3.455-3.455 3.455 3.455 3.455 3.455-3.455Zm.002 86.537-3.455-3.455-3.455 3.455 3.455 3.454 3.455-3.454ZM43.494 79.45l-3.455-3.454-3.455 3.455 3.455 3.454 3.455-3.454Z"
          stroke="#FF0"
        />
      </g>
      <defs>
        <filter
          id={getId('a')}
          x={0}
          y={0}
          width={160}
          height={160}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={8} />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10660_413876" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10660_413876" result="shape" />
        </filter>
        <filter
          id={getId('b')}
          x={53.234}
          y={44.799}
          width={52.583}
          height={68.709}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10660_413876" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10660_413876" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
