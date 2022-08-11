import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const TezosBackActiveIcon: FC<IconProps> = ({ ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSideBQuipuIconNew');

  return (
    <svg width={160} height={160} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter={getUrl('a')}>
        <path
          d="M80.007 144c35.346 0 64-28.654 64-64 0-35.346-28.654-64-64-64-35.346 0-64 28.654-64 64 0 35.346 28.654 64 64 64Z"
          fill="#FCBF12"
        />
        <path
          d="M79.581 133.094c29.803 0 53.963-24.16 53.963-53.963S109.384 25.17 79.581 25.17 25.618 49.329 25.618 79.13c0 29.803 24.16 53.963 53.963 53.963Z"
          fill="#DB9605"
        />
        <g filter={getUrl('b')}>
          <path d="M43.157 71.86v-5.262H65.81v5.261h-8.127V93.4h-6.385V71.86h-8.14Z" fill="#FF0" />
        </g>
        <g filter={getUrl('c')}>
          <path
            d="M68.991 93.4V66.6H87.68v5.261H75.47v5.497h11.256v5.273H75.47v5.51h12.21v5.26H68.99V93.4Z"
            fill="#FF0"
          />
        </g>
        <g filter={getUrl('d')}>
          <path
            d="M91.644 93.4v-3.69l13.021-17.85H91.656v-5.262h21.201v3.69L99.836 88.14h13.008v5.26h-21.2Z"
            fill="#FF0"
          />
        </g>
        <path
          d="m79.58 34.287-3.454 3.455 3.455 3.455 3.455-3.455-3.455-3.455Zm11.37 7.931-3.455 3.455 3.455 3.455 3.455-3.455-3.455-3.455Zm-22.741 0-3.455 3.455 3.455 3.455 3.455-3.455-3.455-3.455Zm14.828 78.277-3.455-3.455-3.455 3.455 3.455 3.455 3.455-3.455Zm11.37-7.931-3.455-3.455-3.455 3.455 3.455 3.455 3.455-3.455Zm-22.741 0-3.455-3.455-3.455 3.455 3.455 3.454 3.455-3.454Z"
          stroke="#FF0"
        />
      </g>
      <defs>
        <filter
          id={getId('a')}
          x={0}
          y={0}
          width={160.007}
          height={160}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={8} />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10660_413942" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10660_413942" result="shape" />
        </filter>
        <filter
          id={getId('b')}
          x={39.157}
          y={62.598}
          width={30.652}
          height={34.801}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10660_413942" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10660_413942" result="shape" />
        </filter>
        <filter
          id={getId('c')}
          x={64.991}
          y={62.6}
          width={26.689}
          height={34.801}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10660_413942" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10660_413942" result="shape" />
        </filter>
        <filter
          id={getId('d')}
          x={87.644}
          y={62.598}
          width={29.213}
          height={34.801}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10660_413942" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10660_413942" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};
