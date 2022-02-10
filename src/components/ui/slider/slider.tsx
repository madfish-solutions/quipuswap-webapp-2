import React, { useContext } from 'react';

import { Card, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import ReactSlider from 'react-slick';

import s from './slider.module.scss';

const SliderSettings = {
  slidesToShow: 3,
  slidesToScroll: 3,
  dots: true,
  infinite: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ],
  customPaging: () => <div className={s.dot} />
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Slider = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const slides = [1, 2, 3, 4, 5, 6, 7, 8];

  const compoundClassnames = cx(modeClass[colorThemeMode], s.root);

  return (
    <Card className={compoundClassnames} isV2>
      <ReactSlider {...SliderSettings}>
        {slides.map(slide => (
          <div key={slide} className={s.div}>
            {slide}
          </div>
        ))}
      </ReactSlider>
    </Card>
  );
};
