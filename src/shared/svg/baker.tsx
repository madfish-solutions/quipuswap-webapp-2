import { useContext, FC } from 'react';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { IconProps } from '@shared/types';

export const Baker: FC<IconProps> = ({ className }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const topColor = colorThemeMode === ColorModes.Dark ? '#14171E' : '#A1A4B1';
  const botColor = colorThemeMode === ColorModes.Dark ? '#505565' : '#F0F1F3';

  return (
    <svg
      width="128"
      height="128"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z"
        fill={topColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M64 6.10352e-05C28.6538 6.10352e-05 0 28.6538 0 64.0001C0 99.3463 28.6538 128 64 128C99.3462 128 128 99.3463 128 64.0001C128 28.6538 99.3462 6.10352e-05 64 6.10352e-05ZM42.1048 62.1013C42.1048 64.3104 43.8957 66.1013 46.1048 66.1013H81.8951C84.1043 66.1013 85.8952 64.3104 85.8952 62.1013V59.2891C85.8952 57.4953 87.126 55.9786 88.7078 55.1326C91.9017 53.4243 94 50.5829 94 47.3696C94 42.0863 88.4355 37.8837 81.4194 37.8837C80.7974 37.8837 80.1917 37.9161 79.6024 37.9809C77.8482 38.1737 76.042 37.5745 74.7736 36.3475C72.0064 33.6706 68.2327 32 64 32C59.7673 32 55.9936 33.6706 53.2264 36.3475C51.958 37.5745 50.1518 38.1737 48.3976 37.9809C47.8083 37.9161 47.2026 37.8837 46.5806 37.8837C39.6855 37.8837 34 42.2064 34 47.3696C34.0951 50.674 36.1346 53.5329 39.2952 55.2461C40.8722 56.101 42.1048 57.6153 42.1048 59.4092V62.1013ZM41.6209 72.9456C41.6209 85.6735 51.5403 96 63.758 96C75.9758 96 85.8951 85.6735 85.8951 72.9456C85.8951 72.4653 85.8649 71.985 85.8346 71.5047C85.7846 70.7096 85.1284 70.0638 84.3317 70.0638H41.8629L41.8629 70.0638C41.7419 71.0244 41.6209 71.985 41.6209 72.9456Z"
        fill={botColor}
      />
    </svg>
  );
};
