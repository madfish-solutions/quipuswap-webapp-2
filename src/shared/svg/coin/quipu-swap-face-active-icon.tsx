import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const QuipuSwapFaceActiveIcon: FC<IconProps> = ({ ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSideBQuipuIconNew');

  return (
    <svg width={160} height={160} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter={getUrl('a')}>
        <path
          d="M80 144c35.346 0 64-28.654 64-64 0-35.346-28.654-64-64-64-35.346 0-64 28.654-64 64 0 35.346 28.654 64 64 64Z"
          fill="#FCBF12"
        />
        <path
          d="M79.574 133.095c29.802 0 53.962-24.16 53.962-53.962 0-29.803-24.16-53.963-53.962-53.963-29.803 0-53.963 24.16-53.963 53.963 0 29.802 24.16 53.962 53.963 53.962Z"
          fill="#DB9605"
        />
        <g filter={getUrl('b')}>
          <path d="M88.487 82.239a3.956 3.956 0 1 0 0-7.913 3.956 3.956 0 0 0 0 7.913Z" fill="#FF0" />
        </g>
        <g filter={getUrl('c')}>
          <path d="M70.406 82.239a3.956 3.956 0 1 0 0-7.913 3.956 3.956 0 0 0 0 7.913Z" fill="#FF0" />
        </g>
        <g filter={getUrl('d')}>
          <path
            d="M89.112 98.06a3.328 3.328 0 0 0 3.329-3.33v-3.416c0-.644-.52-1.165-1.165-1.165h-2.791l-1.563 7.91h2.19Z"
            fill="#FF0"
          />
        </g>
        <g filter={getUrl('e')}>
          <path
            d="M77.965 90.149h-1.91l-1.562 7.91h9.904l-1.562-7.91h-1.91a2.24 2.24 0 0 1-1.48.565 2.242 2.242 0 0 1-1.48-.565Z"
            fill="#FF0"
          />
        </g>
        <g filter={getUrl('f')}>
          <path
            d="M67.637 90.149c-.644 0-1.165.52-1.165 1.165v3.417a3.328 3.328 0 0 0 3.329 3.328h2.165l-1.562-7.91h-2.767Z"
            fill="#FF0"
          />
        </g>
        <path
          d="M55.15 82.239a3.956 3.956 0 0 0-3.957 3.956 3.95 3.95 0 0 0 2.304 3.583 1.66 1.66 0 0 1 .09-.288 1.705 1.705 0 0 1 1.56-1.037c.936 0 1.696.758 1.696 1.696h2.26v-7.91H55.15Zm52.547 3.954a3.956 3.956 0 0 0-3.956-3.957h-3.957v7.91h2.261a1.694 1.694 0 0 1 3.348-.373 3.938 3.938 0 0 0 2.304-3.58Z"
          stroke="#FF0"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M99.787 76.586h-3.574c-.026-.12-.063-.24-.094-.358a7.86 7.86 0 0 1 .279 2.052 7.911 7.911 0 0 1-7.91 7.91h2.752a5.16 5.16 0 0 1 5.16 5.16v3.34c0 1.882-.715 3.59-1.882 4.889a6.776 6.776 0 0 0 5.272-6.607V76.586h-.003ZM81.224 75.15l-.015.026c-.02-.024-.046-.04-.065-.065a.937.937 0 0 1 .06.075c.007-.012.012-.024.02-.036ZM62.493 91.353a5.16 5.16 0 0 1 5.161-5.16h1.163a7.912 7.912 0 0 1 1.59-15.661 7.908 7.908 0 0 1 7.231 4.712 1.78 1.78 0 0 1 .112-.135c-.022.024-.046.04-.068.067a7.91 7.91 0 0 0-15.002 1.41h-3.574v16.386a6.78 6.78 0 0 0 5.272 6.607 7.289 7.289 0 0 1-1.882-4.89v-3.336h-.003Z"
          stroke="#FF0"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M96.397 91.353a5.16 5.16 0 0 0-5.16-5.16h-4.829a2.253 2.253 0 0 1-2.238 2.057h-2.464v.203c0 .678-.306 1.282-.78 1.696h10.349c.645 0 1.166.52 1.166 1.165v3.417a3.328 3.328 0 0 1-3.329 3.328h-2.188l-.157.797a1.128 1.128 0 0 1-2.21 0l-.157-.797h-9.904l-.158.797a1.128 1.128 0 0 1-2.21 0l-.162-.797H69.8a3.328 3.328 0 0 1-3.329-3.328v-3.417c0-.644.521-1.165 1.166-1.165h10.326a2.241 2.241 0 0 1-.78-1.696v-.203h-2.058a2.254 2.254 0 0 1-2.224-1.897h-2.5a7.98 7.98 0 0 1-1.59-.16H67.65a5.16 5.16 0 0 0-5.16 5.16v3.339c0 1.882.714 3.59 1.882 4.889a7.299 7.299 0 0 0 5.441 2.435H89.07a7.292 7.292 0 0 0 5.441-2.435 7.29 7.29 0 0 0 1.883-4.89v-3.338h.004Z"
          stroke="#FF0"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M91.276 90.391c.508 0 .923.415.923.923v3.417a3.09 3.09 0 0 1-3.087 3.086h-1.894l1.465-7.426h2.593Zm0-.242h-2.791l-1.563 7.91h2.188a3.328 3.328 0 0 0 3.329-3.328v-3.417a1.16 1.16 0 0 0-1.163-1.165Zm-8.64.242 1.466 7.426h-9.316l1.466-7.426h1.62a2.485 2.485 0 0 0 1.57.565c.568 0 1.12-.201 1.57-.565h1.624Zm.199-.242h-1.91a2.24 2.24 0 0 1-1.48.565 2.242 2.242 0 0 1-1.48-.565h-1.91l-1.562 7.91h9.904l-1.562-7.91Zm-12.63.242 1.466 7.426H69.8a3.09 3.09 0 0 1-3.088-3.086v-3.417c0-.508.415-.923.924-.923h2.568Zm.2-.242H67.64c-.644 0-1.165.52-1.165 1.165v3.417a3.328 3.328 0 0 0 3.328 3.328h2.164l-1.56-7.91Z"
          fill="#FF0"
          opacity={0.19}
        />
        <path
          d="m70.406 90.149 1.56 7.91.158.797a1.128 1.128 0 0 0 2.21 0l.157-.797 1.563-7.91h-5.648Zm14.149 8.707a1.128 1.128 0 0 0 2.21 0l.157-.797 1.563-7.91h-5.65l1.563 7.91.157.797Zm19.186-10.403c-.935 0-1.696.758-1.696 1.696v7.91a1.696 1.696 0 0 0 3.392 0v-7.91c0-.129-.017-.252-.044-.37a1.693 1.693 0 0 0-1.652-1.326Zm-48.591 0a1.739 1.739 0 0 0-.86.237 1.656 1.656 0 0 0-.79 1.088c-.003.01-.008.02-.01.03a1.777 1.777 0 0 0-.034.34v7.911a1.696 1.696 0 0 0 3.392 0v-7.91a1.701 1.701 0 0 0-1.698-1.696Zm15.254-18.081a7.91 7.91 0 0 1 7.275 4.804c.02-.024.046-.043.068-.068.068-.077.138-.15.216-.215l.13-.11c.083-.06.168-.113.257-.164.049-.027.097-.058.15-.08.1-.046.204-.08.308-.111.049-.015.095-.034.146-.046.157-.034.32-.056.489-.056h.002c.17 0 .332.022.49.056.048.012.094.029.143.043.106.032.21.066.312.112.051.024.097.053.146.08a2.088 2.088 0 0 1 .39.271c.077.068.15.14.22.22.02.025.046.042.066.066.004-.01.01-.017.014-.027a7.97 7.97 0 0 1 .58-1.085c.18-.288.375-.567.59-.829.005-.007.013-.012.017-.02a7.899 7.899 0 0 1 .863-.874c.254-.223.516-.436.797-.625.007-.005.015-.007.02-.012a7.746 7.746 0 0 1 1.087-.6 7.61 7.61 0 0 1 .957-.376c.005-.003.01-.003.015-.005.324-.1.659-.172 1-.23.088-.015.175-.03.264-.041.352-.049.705-.08 1.069-.08.257 0 .509.014.758.038.083.007.163.022.245.032.167.022.332.043.494.075.095.02.19.041.281.063.145.034.293.07.436.111.097.03.192.059.286.09a10.326 10.326 0 0 1 .686.262c.133.058.264.123.395.189.084.043.172.084.254.13.14.078.279.165.414.252.066.042.134.08.197.124.191.13.378.269.554.414.07.058.134.119.201.18.11.096.221.19.325.295.078.075.15.158.226.235a7.195 7.195 0 0 1 .69.843c.068.097.136.194.199.293a10.654 10.654 0 0 1 .361.621c.055.104.104.213.155.322.05.109.104.218.15.33.048.118.09.242.133.363.07.194.131.392.184.593.032.12.068.238.095.359h5.831c.936 0 1.696-.758 1.696-1.696v-6.781c0-.936-.758-1.696-1.696-1.696h-2.258v-11.3l-1.121 3.772-2.26 7.535h-2.261V51.726c-.79 0-1.447.54-1.636 1.272l-3.45 13.42h-2.825L84.31 49.836a1.695 1.695 0 0 0-1.683-1.5H76.26c-.86 0-1.585.645-1.684 1.5l-1.914 16.582h-2.825l-3.45-13.42a1.692 1.692 0 0 0-1.636-1.272v14.692h-2.26l-2.26-7.535-1.13-3.767v11.3h-2.258a1.74 1.74 0 0 0-.504.075 1.608 1.608 0 0 0-.443.213c-.404.274-.685.72-.739 1.233-.005.058-.01.114-.01.175v6.78a1.71 1.71 0 0 0 .206.81 1.707 1.707 0 0 0 .543.598 1.712 1.712 0 0 0 .947.288h5.832c.78-3.556 3.942-6.216 7.729-6.216Z"
          stroke="#FF0"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M95.799 75.27c-.047-.11-.1-.22-.15-.329-.052-.109-.1-.215-.156-.322-.055-.106-.116-.21-.177-.315-.06-.102-.12-.206-.184-.305a7.855 7.855 0 0 0-.416-.587 6.78 6.78 0 0 0-.216-.266c-.082-.097-.17-.189-.257-.283-.075-.08-.148-.16-.225-.235a7.53 7.53 0 0 0-.325-.296c-.068-.058-.133-.121-.201-.18a7.665 7.665 0 0 0-.555-.414c-.063-.043-.13-.082-.196-.123a8.977 8.977 0 0 0-.414-.252c-.083-.046-.17-.087-.255-.131-.13-.065-.259-.13-.395-.189a5.552 5.552 0 0 0-.278-.114 7.325 7.325 0 0 0-.693-.237 8.152 8.152 0 0 0-.436-.112 15.953 15.953 0 0 0-.281-.063c-.163-.031-.33-.053-.495-.075-.082-.01-.162-.024-.244-.031a7.835 7.835 0 0 0-.759-.04c-.363 0-.72.035-1.068.08-.087.013-.177.025-.264.042a8.1 8.1 0 0 0-1 .23l-.015.005a7.776 7.776 0 0 0-1.185.485c-.298.147-.586.31-.86.492-.007.004-.015.007-.02.012a7.682 7.682 0 0 0-.797.625l-.179.162c-.24.225-.472.46-.683.712-.005.008-.012.012-.017.02a8.01 8.01 0 0 0-.591.828c-.044.068-.082.136-.124.204a8.165 8.165 0 0 0-.455.882l-.017.036c.308.385.499.87.499 1.403v7.142h2.464a2.261 2.261 0 0 1 2.26 2.26c0 .07-.014.136-.02.204h2.077a7.911 7.911 0 0 0 7.91-7.91 7.84 7.84 0 0 0-.278-2.052 8.041 8.041 0 0 0-.184-.594c-.056-.126-.095-.247-.145-.368Zm-20.671 8.459h2.057v-7.143c0-.504.172-.966.45-1.342a7.908 7.908 0 0 0-15.142 3.198 7.912 7.912 0 0 0 7.91 7.91h2.5a2.252 2.252 0 0 1-.035-.363 2.263 2.263 0 0 1 2.26-2.26Z"
          stroke="#FF0"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M84.17 83.729h-2.464v4.52h2.464a2.253 2.253 0 0 0 2.239-2.056c.007-.068.019-.134.019-.204a2.258 2.258 0 0 0-2.258-2.26Zm-9.042 0a2.261 2.261 0 0 0-2.26 2.26c0 .124.016.245.035.364a2.257 2.257 0 0 0 2.225 1.897h2.057v-4.521h-2.057Zm6.578-7.143c0-.533-.192-1.015-.5-1.403l-.06-.075a2.087 2.087 0 0 0-.35-.324 2.087 2.087 0 0 0-.26-.168c-.05-.026-.095-.055-.146-.08a2.28 2.28 0 0 0-.313-.11c-.048-.015-.094-.035-.143-.044a2.332 2.332 0 0 0-.489-.056h-.002c-.168 0-.332.022-.49.056-.05.012-.097.031-.145.046a2.11 2.11 0 0 0-.308.111c-.05.024-.1.053-.15.08a1.85 1.85 0 0 0-.388.274 2.596 2.596 0 0 0-.327.351c-.28.376-.45.838-.45 1.342v11.867c0 .678.305 1.282.78 1.696.397.346.91.564 1.48.564s1.083-.218 1.48-.564a2.24 2.24 0 0 0 .78-1.696V76.586Zm8.69 44.313-.336-1.434a3.088 3.088 0 0 0-2.3-2.3l-1.434-.336 1.434-.337a3.089 3.089 0 0 0 2.3-2.299l.336-1.435.337 1.435a3.088 3.088 0 0 0 2.3 2.299l1.434.337-1.435.336a3.088 3.088 0 0 0-2.299 2.3l-.337 1.434Zm-21.943 0-.337-1.434a3.088 3.088 0 0 0-2.299-2.3l-1.434-.336 1.434-.337a3.088 3.088 0 0 0 2.3-2.299l.336-1.435.337 1.435a3.089 3.089 0 0 0 2.3 2.299l1.433.337-1.434.336a3.088 3.088 0 0 0-2.3 2.3l-.336 1.434Z"
          stroke="#FF0"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="m79.423 108.872-.007.037.015-.01-.008-.027Z" fill="#FF0" />
        <path
          d="m97.71 40.693 1.028-2.396a.748.748 0 1 0-1.379-.587l-1.024 2.397a.75.75 0 0 0 .685 1.044.76.76 0 0 0 .69-.458Zm1.372-2.249-1.047 2.45a.752.752 0 0 0 .415.93.75.75 0 0 0 .983-.395l1.027-2.396a.744.744 0 0 0-.394-.981.747.747 0 0 0-.984.392ZM59.334 42.21l-1.284-2.268a.747.747 0 0 0-1.02-.281.75.75 0 0 0-.281 1.02l1.284 2.268a.75.75 0 0 0 1.3-.74Zm-.959-2.452 1.313 2.316c.145.218.39.337.64.33a.75.75 0 0 0 .632-1.117l-1.284-2.268a.748.748 0 1 0-1.301.739Zm-5.439 5.356a.733.733 0 0 0 1.017.114 43.82 43.82 0 0 1 3.525-2.502l-.722-1.277a44.763 44.763 0 0 0-3.702 2.626.73.73 0 0 0-.118 1.04ZM76.484 34.18l.059 2.663a.744.744 0 0 0 .76.674.748.748 0 0 0 .732-.766l-.053-2.604a.747.747 0 0 0-.763-.732.753.753 0 0 0-.734.766Zm3.424 2.532-.053-2.604a.75.75 0 1 0-1.497.034l.053 2.604a.748.748 0 1 0 1.497-.034Zm21.434 5.013a41.629 41.629 0 0 1 3.862 2.495.735.735 0 0 0 .897-.021l.009-.008a.732.732 0 0 0-.031-1.158 43.034 43.034 0 0 0-4.148-2.68 44.152 44.152 0 0 0-1.32-.721l-.587 1.373c.444.23.882.47 1.318.72Zm-5.865-4.371a44.103 44.103 0 0 0-13.74-2.684l-.37-.015a42.35 42.35 0 0 0-1.127-.014l.032 1.488c.402 0 .804.004 1.206.016l.293.012a42.823 42.823 0 0 1 14.52 3.111l.586-1.37a36.77 36.77 0 0 0-1.4-.544Zm-19.353-2.548a118.8 118.8 0 0 0-1.492.181c-.124.015-.248.032-.371.046a43.391 43.391 0 0 0-13.895 4.347l.727 1.281a42.165 42.165 0 0 1 13.277-4.138c.097-.014.194-.024.293-.038.397-.054.797-.1 1.197-.14v-.006l.295-.029-.031-1.504Z"
          stroke="#FF0"
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
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
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10351_444314" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10351_444314" result="shape" />
        </filter>
        <filter
          id={getId('b')}
          x={80.53}
          y={70.326}
          width={15.913}
          height={15.913}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10351_444314" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10351_444314" result="shape" />
        </filter>
        <filter
          id={getId('c')}
          x={62.449}
          y={70.326}
          width={15.913}
          height={15.913}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10351_444314" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10351_444314" result="shape" />
        </filter>
        <filter
          id={getId('d')}
          x={82.922}
          y={86.149}
          width={13.52}
          height={15.91}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10351_444314" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10351_444314" result="shape" />
        </filter>
        <filter
          id={getId('e')}
          x={70.493}
          y={86.149}
          width={17.904}
          height={15.91}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10351_444314" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10351_444314" result="shape" />
        </filter>
        <filter
          id={getId('f')}
          x={62.472}
          y={86.149}
          width={13.495}
          height={15.91}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_10351_444314" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_10351_444314" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};