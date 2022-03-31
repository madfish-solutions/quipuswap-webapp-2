import { FC, useContext } from 'react';

import { Card, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import ReactSlider from 'react-slick';

import styles from './slider.module.scss';

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

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  className?: string;
}

export const Slider: FC<Props> = ({ className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassnames = cx(className, modeClass[colorThemeMode], styles.root);

  return (
    <Card className={compoundClassnames} isV2>
      <ReactSlider {...SliderSettings}>{children}</ReactSlider>
    </Card>
  );
};
