import React, { FC, ReactNode, useContext } from 'react';

import { Card, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import ReactSlider from 'react-slick';

import s from './slider.module.scss';

const SliderSettings = {
  slidesToShow: 4,
  slidesToScroll: 4,
  dots: true,
  infinite: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
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

interface SliderProps {
  className?: string;
  slides: Array<ReactNode>;
}

export const Slider: FC<SliderProps> = ({ className, slides }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassnames = cx(className, modeClass[colorThemeMode], s.root);

  return (
    <Card className={compoundClassnames} isV2>
      <ReactSlider {...SliderSettings}>{slides}</ReactSlider>
    </Card>
  );
};
