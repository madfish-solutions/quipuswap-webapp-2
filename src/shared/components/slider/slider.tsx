import { FC, useContext } from 'react';

import cx from 'classnames';
import ReactSlider, { ResponsiveObject } from 'react-slick';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './slider.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface SliderProps {
  items?: number;
  unCenter?: boolean;
  responsive?: ResponsiveObject[];
  className?: string;
}

const DEFAULT_AMOUNT_OD_SLIDES = 1;

const SliderSettings = {
  slidesToShow: 4,
  slidesToScroll: 4,
  dots: true,
  infinite: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 620,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ],
  customPaging: () => <div className={styles.dot} />
};

export const Slider: FC<SliderProps> = ({
  children,
  items = DEFAULT_AMOUNT_OD_SLIDES,
  responsive = [],
  unCenter = false,
  className
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, className, modeClass[colorThemeMode], { [styles.unCenter]: unCenter })}>
      <ReactSlider {...SliderSettings}>{children}</ReactSlider>
    </div>
  );
};
