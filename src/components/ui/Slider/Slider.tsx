import React, { useContext } from 'react';
import cx from 'classnames';
import Slider, { ResponsiveObject } from 'react-slick';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import s from './Slider.module.sass';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

type SliderProps = {
  items?: number
  unCenter?: boolean
  responsive?: ResponsiveObject[]
  className?: string
};

export const SliderUI: React.FC<SliderProps> = ({
  children,
  items = 1,
  responsive = [],
  unCenter = false,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: items,
    slidesToScroll: items,
    responsive,
    customPaging: () => (
      <div className={modeClass[colorThemeMode]}>
        <div className={s.dot} />
      </div>
    ),
  };

  return (
    <div className={cx(
      s.root,
      className,
      modeClass[colorThemeMode],
      { [s.unCenter]: unCenter },
    )}
    >
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  );
};
