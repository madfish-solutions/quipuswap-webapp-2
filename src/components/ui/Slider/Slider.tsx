import React, { useContext } from 'react';
import Slider from 'react-slick';

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
};

export const SliderUI: React.FC<SliderProps> = ({ children, items = 1 }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: items,
    slidesToScroll: items,
    customPaging: () => (
      <div className={modeClass[colorThemeMode]}>
        <div className={s.dot} />
      </div>
    ),
  };

  return (
    <div className={modeClass[colorThemeMode]}>
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  );
};
