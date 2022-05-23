import { useContext } from 'react';

import cx from 'classnames';
import ReactSlider from 'react-slick';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CFC } from '@shared/types';

import { Card } from '../card';
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

export const Slider: CFC<Props> = ({ className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassnames = cx(className, modeClass[colorThemeMode], styles.root);

  return (
    <Card className={compoundClassnames} isV2>
      <ReactSlider {...SliderSettings}>{children}</ReactSlider>
    </Card>
  );
};
