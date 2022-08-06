import { FC } from 'react';

import { IconProps } from '@shared/types';

import { useSvgHelper } from '../../hooks';

export const QuipuSwapBackDefaultIcon: FC<IconProps> = ({ ...props }) => {
  const { getId, getUrl } = useSvgHelper('CoinSideAQuipuIconNew');

  return (
    <svg width={128} height={128} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M64 128c35.346 0 64-28.654 64-64 0-35.346-28.654-64-64-64C28.654 0 0 28.654 0 64c0 35.346 28.654 64 64 64Z"
        fill="#FCBF12"
      />
      <path
        opacity={0.71}
        d="M63.533 117.094c29.803 0 53.963-24.16 53.963-53.963S93.336 9.168 63.533 9.168 9.57 33.328 9.57 63.131s24.16 53.963 53.963 53.963Z"
        fill="#101A23"
      />
      <path
        d="M63.576 117.094c29.803 0 53.963-24.16 53.963-53.963S93.379 9.168 63.576 9.168 9.613 33.328 9.613 63.131s24.16 53.963 53.963 53.963Z"
        fill="#F9A605"
      />
      <g opacity={0.29} fill="#000">
        <path
          opacity={0.29}
          d="M64.656 79.29c-9.629 0-17.464-7.835-17.464-17.464 0-9.63 7.835-17.465 17.464-17.465 9.63 0 17.465 7.836 17.465 17.465 0 .905-.07 1.794-.203 2.66-.016.103-.755-.724-.772-.621l.682 1.155 5.872 5.872a24.617 24.617 0 0 0 1.719-9.066c0-13.654-11.107-24.76-24.76-24.76-13.655 0-24.762 11.108-24.762 24.76 0 13.654 11.109 24.76 24.761 24.76 3.14 0 6.146-.588 8.913-1.66l-.683-1.156-5.215-4.741c-.981.172-1.989.261-3.017.261Z"
        />
        <path
          opacity={0.29}
          d="m74.319 70.184 8.97 8.988a3.649 3.649 0 0 0 5.16 0 3.647 3.647 0 0 0 0-5.159l-8.972-8.987a3.647 3.647 0 1 0-5.158 5.158ZM82 80.46l-9.175-9.175a3.649 3.649 0 0 0-4.956.188 3.648 3.648 0 0 0 0 5.159l8.971 8.987A3.649 3.649 0 0 0 82 80.461Z"
        />
      </g>
      <path
        d="M63.975 78.135c-9.63 0-17.465-7.836-17.465-17.465 0-9.63 7.835-17.465 17.465-17.465 9.629 0 17.464 7.836 17.464 17.465 0 1.092-.102 2.16-.294 3.195l5.871 5.871a24.617 24.617 0 0 0 1.72-9.066c0-13.654-11.108-24.76-24.761-24.76-13.654 0-24.761 11.108-24.761 24.762s11.108 24.76 24.76 24.76c3.14 0 6.146-.588 8.913-1.66l-5.897-5.897c-.98.17-1.988.26-3.015.26Z"
        fill="#F9C23A"
      />
      <path
        opacity={0.29}
        d="M15.104 65.353c0-29.802 24.16-53.963 53.963-53.963a54.01 54.01 0 0 1 15.393 2.231 53.773 53.773 0 0 0-21.114-4.288c-29.802 0-53.963 24.16-53.963 53.963 0 24.453 16.267 45.105 38.57 51.73-19.31-8.217-32.849-27.364-32.849-49.673Z"
        fill="#0D161C"
      />
      <g opacity={0.29}>
        <path
          opacity={0.29}
          d="m82.012 99.337 1.207 2.31a.748.748 0 0 0 1.406-.426c-.01-.092-.148-.714-.194-.801l-1.094-1.778a.75.75 0 0 0-1.01-.316c-.092.048-.469-.371-.531-.294-.185.224.071 1.03.216 1.305Zm.751 1.907-1.111-1.78a.75.75 0 0 0-.628-.354c-.118-.001-.642-.413-.755-.353-.366.192-.106 1.083.086 1.449l1.207 2.309a.747.747 0 0 0 1.011.317.75.75 0 0 0 .386-.816c-.017-.068-.163-.709-.196-.772Zm22.35-32.588 2.569.44a.747.747 0 0 0 .863-.612c.026-.15-.162-.991-.219-1.121-.097-.223-.133.3-.393.256l-2.569-.441c-.408-.07-.988-.367-1.057.04-.018.103.181.776.203.869a.751.751 0 0 0 .603.569Z"
          fill="#000"
        />
        <path
          opacity={0.29}
          d="m107.62 69.464-2.625-.448a.75.75 0 0 0-.661.285c-.073.095-.314-.324-.336-.197-.016.093.194.8.194.8.058.297.294.54.609.593l2.569.44a.748.748 0 0 0 .863-.612c.024-.135-.174-.998-.219-1.119-.092-.238-.121.305-.394.258Zm-.707-7.602a.731.731 0 0 0-.732.715 43.689 43.689 0 0 1-.186 3.328c-.016.174-.289.253-.289.253l.183.731 1.446.249a43.652 43.652 0 0 0 .309-4.527c.004-.259 0-1-.309-1.156-.126-.066-.268.407-.422.407Zm-6.297 24.75-2.184-1.527a.75.75 0 0 0-.718-.023c-.106.053-.564-.271-.564-.271-.084.272.004.671.18 1.13.067.157.144.316.294.422l2.134 1.496a.752.752 0 0 0 1.042-.183.755.755 0 0 0 .13-.34c.015-.124-.175-.958-.221-1.073-.053-.134.031.457-.093.37Z"
          fill="#000"
        />
        <path
          opacity={0.29}
          d="m96.55 87.877 2.134 1.496a.749.749 0 0 0 1.176-.567c.014-.252-.165-1.137-.386-1.292l-2.066-.863a.748.748 0 0 0-1.043.184c-.058.084-.296-.365-.316-.27-.037.17.186.89.265 1.044a.735.735 0 0 0 .236.269Z"
          fill="#000"
        />
        <g opacity={0.29}>
          <path
            opacity={0.29}
            d="M105.195 70.996a42.209 42.209 0 0 1-5.633 13.606c-.059.092-.545-.171-.545-.171l.183.731 1.221.856a43.453 43.453 0 0 0 6.228-14.775l-.183-.731-.578.601-.693-.117ZM96.767 88.49a42.726 42.726 0 0 1-12.412 10.46c-.055.03-.521-.545-.521-.545l.183.731.691 1.322a44.16 44.16 0 0 0 12.321-9.96c.327-.38.65-.764.962-1.154l-.183-.731-1.04-.123Zm-17.853 13.005a41.765 41.765 0 0 1-4.376 1.412c-.324.084-.719.135-.719.135 0 .133.205.845.266.951a.733.733 0 0 0 .82.344 43.808 43.808 0 0 0 6.093-2.083l-.183-.732-.51-.592c-.459.197-.921.386-1.391.565Z"
            fill="#000"
          />
        </g>
      </g>
      <path
        d="m81.828 98.606 1.207 2.309a.747.747 0 0 0 1.01.317.75.75 0 0 0 .316-1.012l-1.207-2.31a.75.75 0 0 0-1.326.696Zm.875 2.483-1.234-2.359a.75.75 0 0 0-.982-.267.75.75 0 0 0-.317 1.011l1.207 2.31a.747.747 0 0 0 1.011.316.75.75 0 0 0 .315-1.011Zm22.227-33.165 2.569.44a.748.748 0 1 0 .251-1.475l-2.569-.44a.747.747 0 1 0-.251 1.475Zm2.507.808-2.626-.448a.75.75 0 0 0-.806.618.748.748 0 0 0 .612.864l2.57.44a.748.748 0 1 0 .25-1.474Zm-.707-7.601a.73.73 0 0 0-.731.715 43.69 43.69 0 0 1-.291 4.312l1.446.248a43.652 43.652 0 0 0 .309-4.528.734.734 0 0 0-.733-.747Zm-6.297 24.749-2.184-1.526a.75.75 0 0 0-.993.216.748.748 0 0 0 .185 1.042l2.134 1.496a.752.752 0 0 0 1.042-.183.748.748 0 0 0-.184-1.044Zm-4.065 1.266 2.133 1.496a.749.749 0 0 0 .858-1.227l-2.134-1.496a.748.748 0 1 0-.857 1.227Zm8.644-16.881a42.219 42.219 0 0 1-5.995 14.166l1.221.855a43.424 43.424 0 0 0 6.228-14.775l-1.454-.246Zm-8.427 17.493a42.726 42.726 0 0 1-12.75 10.644l.69 1.323a44.165 44.165 0 0 0 12.32-9.96c.328-.38.65-.765.963-1.154l-1.223-.853ZM78.73 100.763a41.54 41.54 0 0 1-4.375 1.412.733.733 0 0 0-.55.708v.013c0 .479.453.83.918.709a43.593 43.593 0 0 0 6.092-2.083l-.693-1.324c-.459.198-.921.386-1.391.565Z"
        fill="#FCBF12"
      />
      <g opacity={0.29}>
        <path
          opacity={0.29}
          d="m45.989 99.337-1.207 2.31a.748.748 0 0 1-1.353-.635c.009-.02.128-.559.137-.58l.079.161 1.018-1.95a.75.75 0 0 1 1.353.054c.033.077.227-.404.233-.322.005.084-.178.734-.202.816a.677.677 0 0 1-.058.146Zm-.874 2.483.111-.528 1.123-1.83a.75.75 0 0 1 .982-.267.73.73 0 0 1 .344.376c.027.068.227-.422.234-.349.01.106-.183.781-.22.887a.639.639 0 0 1-.042.097l-1.206 2.309a.747.747 0 0 1-1.012.317.751.751 0 0 1-.314-1.012ZM22.887 68.656l-2.57.44a.747.747 0 0 1-.859-.881c.017-.088.132-.627.178-.702.108-.18.208.146.431.108l2.57-.441c.407-.07.98-.295 1.049.111.018.103-.196.798-.196.798a.753.753 0 0 1-.603.567Z"
          fill="#000"
        />
        <path
          opacity={0.29}
          d="m20.38 69.464 2.626-.448a.75.75 0 0 1 .66.285c.073.095.315-.309.335-.185.031.181-.194.876-.282 1.023a.747.747 0 0 1-.519.358l-2.57.44a.748.748 0 0 1-.862-.866c.016-.099.172-.796.225-.878.11-.168.17.307.387.27Zm.708-7.602a.73.73 0 0 1 .731.715c.017.948.064 1.887.141 2.818.026.31.302.454.333.763l-.183.731-1.447.249a50.33 50.33 0 0 1-.153-1.492 35.638 35.638 0 0 1-.155-3.036c0-.43.151-.916.244-1.04.136-.183.247.292.489.292Zm6.297 24.75 2.183-1.527a.75.75 0 0 1 .993.216c.079.111.307-.331.318-.205.01.106-.19.781-.225.882a.744.744 0 0 1-.277.365l-2.134 1.496a.752.752 0 0 1-1.043-.183.75.75 0 0 1-.135-.46c.005-.116.175-.867.232-.968.053-.1-.009.452.088.384Z"
          fill="#000"
        />
        <path
          opacity={0.29}
          d="m31.45 87.877-2.134 1.496a.749.749 0 0 1-1.172-.698c.01-.094.184-.834.228-.918.053-.103-.014.459.086.387l2.134-1.495a.748.748 0 0 1 1.042.184c.059.084.295-.323.315-.228.02.099-.174.7-.192.799a.756.756 0 0 1-.307.473Z"
          fill="#000"
        />
        <g opacity={0.29}>
          <path
            opacity={0.29}
            d="M22.804 70.996a42.219 42.219 0 0 0 5.193 12.9c.213.348.765.195.986.535l-.183.731-1.221.856a43.432 43.432 0 0 1-6.228-14.775l.182-.732.567.604.704-.119ZM31.232 88.49a42.721 42.721 0 0 0 12.43 10.469c.061.032.504-.556.504-.556l-.183.731-.691 1.322a44.162 44.162 0 0 1-12.32-9.96 40.29 40.29 0 0 1-.963-1.154l.183-.731.61.177.43-.298Zm17.855 13.005a41.536 41.536 0 0 0 4.375 1.411c.324.085.734-.343.734-.01l-.154.733c-.09.461-.483.828-.947.707a43.594 43.594 0 0 1-6.093-2.082l.183-.732.51-.592c.459.197.922.386 1.392.565Z"
            fill="#000"
          />
        </g>
      </g>
      <path
        d="m46.17 98.606-1.206 2.309a.746.746 0 0 1-1.01.317.75.75 0 0 1-.316-1.012l1.207-2.31a.75.75 0 0 1 1.326.696Zm-.873 2.483 1.235-2.359a.75.75 0 0 1 .982-.267.75.75 0 0 1 .316 1.011l-1.207 2.31a.747.747 0 0 1-1.011.316.75.75 0 0 1-.315-1.011ZM23.069 67.924l-2.57.44a.747.747 0 0 1-.862-.612.748.748 0 0 1 .612-.863l2.57-.44a.748.748 0 1 1 .25 1.475Zm-2.507.808 2.626-.448a.75.75 0 0 1 .806.618.748.748 0 0 1-.613.864l-2.569.44a.748.748 0 0 1-.25-1.474Zm.708-7.601a.73.73 0 0 1 .73.715 43.405 43.405 0 0 0 .292 4.312l-1.447.248a44.025 44.025 0 0 1-.309-4.528.735.735 0 0 1 .733-.747Zm6.298 24.749 2.183-1.526a.75.75 0 0 1 .993.216.748.748 0 0 1-.185 1.042l-2.134 1.496a.752.752 0 0 1-1.042-.183.748.748 0 0 1 .185-1.044Zm4.064 1.266-2.134 1.496a.749.749 0 0 1-.858-1.227l2.134-1.496a.748.748 0 1 1 .858 1.227Zm-8.645-16.881a42.216 42.216 0 0 0 5.996 14.166l-1.222.855a43.432 43.432 0 0 1-6.228-14.775l1.454-.246Zm8.428 17.493a42.726 42.726 0 0 0 12.75 10.644l-.69 1.323a44.163 44.163 0 0 1-12.32-9.96c-.33-.38-.65-.765-.964-1.154l1.224-.853Zm17.855 13.005a41.54 41.54 0 0 0 4.375 1.412c.324.084.55.375.55.708v.013c0 .479-.453.83-.918.709a43.593 43.593 0 0 1-6.092-2.083l.693-1.324c.459.198.921.386 1.391.565Z"
        fill="#FCBF12"
      />
      <path
        opacity={0.29}
        d="m63.833 25.375-.3-.549-.038-.884a3.084 3.084 0 0 0-2.299-2.299l-1.433-.337-.3-.548 1.733.212a3.084 3.084 0 0 0 2.299-2.298l.038-1.983.3.549.337 1.434a3.084 3.084 0 0 0 2.298 2.298l1.136-.212.3.549-1.434.336a3.084 3.084 0 0 0-2.299 2.299l-.338 1.433Z"
        fill="#000"
      />
      <path
        d="m63.533 24.826-.336-1.433a3.084 3.084 0 0 0-2.299-2.299l-1.433-.336 1.433-.336a3.084 3.084 0 0 0 2.299-2.299l.336-1.434.337 1.434a3.084 3.084 0 0 0 2.298 2.299l1.434.336-1.434.336a3.084 3.084 0 0 0-2.298 2.299l-.337 1.433Z"
        fill="#FCBF12"
      />
      <path
        opacity={0.29}
        d="m74.805 29.26-.3-.548-.038-.885a3.084 3.084 0 0 0-2.299-2.298l-1.434-.337-.3-.548 1.734.212a3.084 3.084 0 0 0 2.299-2.299l.038-1.982.3.549.336 1.433a3.084 3.084 0 0 0 2.299 2.299l1.1-.22.333.556-1.433.337a3.084 3.084 0 0 0-2.299 2.298l-.336 1.434Z"
        fill="#000"
      />
      <path
        d="m74.505 28.712-.336-1.433a3.084 3.084 0 0 0-2.299-2.299l-1.434-.336 1.434-.337a3.084 3.084 0 0 0 2.299-2.298l.336-1.434.337 1.434a3.084 3.084 0 0 0 2.298 2.298l1.434.337-1.434.336a3.084 3.084 0 0 0-2.298 2.299l-.337 1.433Z"
        fill="#FCBF12"
      />
      <path
        opacity={0.29}
        d="m52.862 29.26-.3-.548-.038-.885a3.084 3.084 0 0 0-2.298-2.298l-1.434-.337-.3-.548 1.734.212a3.084 3.084 0 0 0 2.298-2.299l.039-1.982.3.549.336 1.433a3.084 3.084 0 0 0 2.298 2.299l1.136-.212.3.548-1.434.337a3.084 3.084 0 0 0-2.298 2.298l-.339 1.434Z"
        fill="#000"
      />
      <path
        d="m52.563 28.712-.337-1.433a3.084 3.084 0 0 0-2.298-2.299l-1.434-.336 1.434-.337a3.084 3.084 0 0 0 2.298-2.298l.337-1.434.336 1.434a3.084 3.084 0 0 0 2.299 2.298l1.433.337-1.433.336a3.084 3.084 0 0 0-2.299 2.299l-.336 1.433Z"
        fill="#FCBF12"
      />
      <path opacity={0.08} d="m45.632 44.054 12.08-7.342a24.8 24.8 0 0 0-12.08 7.342Z" fill="#fff" />
      <path
        opacity={0.3}
        d="M108.106 17.626c10.922 11.48 17.625 27.01 17.625 44.105 0 35.346-28.654 64-64 64-17.095 0-32.625-6.704-44.105-17.626C29.285 120.36 45.749 128 64 128c35.347 0 64-28.654 64-64 0-18.251-7.639-34.715-19.894-46.374Z"
        fill="#000"
      />
      <path
        opacity={0.52}
        d="M65.225 1.32c18.213 0 34.646 7.607 46.301 19.817C99.813 8.159 82.86 0 64 0 28.654 0 0 28.654 0 64c0 17.134 6.733 32.697 17.699 44.184C7.459 96.838 1.225 81.808 1.225 65.322c0-35.348 28.654-64.002 64-64.002Z"
        fill="#fff"
      />
      <path
        d="m73.514 68.93 9.05 9.066a3.68 3.68 0 0 0 5.203-5.204l-9.05-9.066a3.68 3.68 0 1 0-5.203 5.204Z"
        fill={getUrl('a')}
      />
      <path
        d="m81.261 79.298-9.256-9.256a3.683 3.683 0 0 0-4.997.188 3.68 3.68 0 0 0 0 5.204l9.05 9.066a3.683 3.683 0 0 0 5.205 0 3.679 3.679 0 0 0-.002-5.202Z"
        fill={getUrl('b')}
      />
      <path
        opacity={0.77}
        d="m73.514 68.93 9.05 9.066a3.68 3.68 0 0 0 5.203-5.204l-9.05-9.066a3.68 3.68 0 1 0-5.203 5.204Z"
        stroke={getUrl('c')}
        strokeMiterlimit={10}
      />
      <path
        opacity={0.77}
        d="m81.261 79.298-9.256-9.256a3.683 3.683 0 0 0-4.997.188 3.68 3.68 0 0 0 0 5.204l9.05 9.066a3.683 3.683 0 0 0 5.205 0 3.679 3.679 0 0 0-.002-5.202Z"
        stroke={getUrl('d')}
        strokeMiterlimit={10}
      />
      <path
        opacity={0.39}
        d="M73.069 65.31a3.677 3.677 0 0 1 6.005-1.223l-.358-.361a3.68 3.68 0 1 0-5.205 5.204l9.05 9.066.007.007-8.693-8.707a3.686 3.686 0 0 1-.806-3.987Zm-5.696 5.287a3.678 3.678 0 0 1 4.998-.188l-.366-.366a3.683 3.683 0 0 0-4.997.189 3.68 3.68 0 0 0 0 5.204l9.05 9.066.006.007-8.692-8.707a3.681 3.681 0 0 1 .001-5.205Z"
        fill="#fff"
      />
      <path
        opacity={0.17}
        d="m87.802 72.826-9.05-9.066-.007-.005 8.691 8.708a3.68 3.68 0 0 1-5.197 5.211l.359.358a3.68 3.68 0 1 0 5.204-5.206Zm-6.872 6.141a3.68 3.68 0 0 1-5.197 5.211l.359.359a3.682 3.682 0 0 0 5.206 0 3.68 3.68 0 0 0 0-5.205l-.368-.365Z"
        fill="#000"
      />
      <path opacity={0.52} d="M75.96 66.138a1.21 1.21 0 1 0 0-2.421 1.21 1.21 0 0 0 0 2.42Z" fill={getUrl('e')} />
      <path opacity={0.52} d="M75.449 69.497a.706.706 0 1 0 0-1.412.706.706 0 0 0 0 1.412Z" fill={getUrl('f')} />
      <path opacity={0.52} d="M69.33 72.686a1.21 1.21 0 1 0 0-2.421 1.21 1.21 0 0 0 0 2.42Z" fill={getUrl('g')} />
      <path opacity={0.52} d="M68.707 76.043a.706.706 0 1 0 0-1.412.706.706 0 0 0 0 1.412Z" fill={getUrl('h')} />
      <defs>
        <linearGradient id={getId('a')} x1={73.51} y1={63.725} x2={87.773} y2={77.988} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9A605" />
          <stop offset={1} stopColor="#FF6B00" />
        </linearGradient>
        <linearGradient id={getId('b')} x1={65.93} y1={77.367} x2={82.435} y2={77.367} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9A605" />
          <stop offset={1} stopColor="#FF6B00" />
        </linearGradient>
        <linearGradient id={getId('c')} x1={72.344} y1={70.861} x2={88.937} y2={70.861} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9A605" />
          <stop offset={1} stopColor="#F36C21" />
        </linearGradient>
        <linearGradient id={getId('d')} x1={65.838} y1={77.367} x2={82.432} y2={77.367} gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9A605" />
          <stop offset={1} stopColor="#F36C21" />
        </linearGradient>
        <linearGradient id={getId('e')} x1={81.006} y1={69.6} x2={75.528} y2={64.527} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#fff" stopOpacity={0} />
          <stop offset={1} stopColor="#fff" />
        </linearGradient>
        <linearGradient id={getId('f')} x1={78.844} y1={71.935} x2={73.366} y2={66.862} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#fff" stopOpacity={0} />
          <stop offset={1} stopColor="#fff" />
        </linearGradient>
        <linearGradient id={getId('g')} x1={72.689} y1={74.249} x2={68.114} y2={70.468} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#fff" stopOpacity={0} />
          <stop offset={1} stopColor="#fff" />
        </linearGradient>
        <linearGradient id={getId('h')} x1={70.538} y1={76.852} x2={65.963} y2={73.07} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#fff" stopOpacity={0} />
          <stop offset={1} stopColor="#fff" />
        </linearGradient>
      </defs>
    </svg>
  );
};
