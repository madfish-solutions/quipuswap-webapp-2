import { useContext } from 'react';

import cx from 'classnames';
import ReactSlider from 'react-slick';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CFC } from '@shared/types';

import styles from './home-slider.module.scss';

const SliderSettings = {
  slidesToShow: 4,
  slidesToScroll: 4,
  dots: true,
  infinite: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 1370,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 610,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true
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

export const HomeSlider: CFC<Props> = ({ className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassnames = cx(className, modeClass[colorThemeMode], styles.root);

  return (
    <div className={compoundClassnames}>
      <ReactSlider {...SliderSettings}>{children}</ReactSlider>
    </div>
  );
};
