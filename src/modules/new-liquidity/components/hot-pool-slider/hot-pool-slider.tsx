import { useContext } from 'react';

import cx from 'classnames';
import ReactSlider from 'react-slick';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CFC } from '@shared/types';

import styles from './hot-pool-slider.module.scss';

const SliderSettings = {
  slidesToShow: 4,
  slidesToScroll: 1,
  infinite: true,
  arrows: false,
  className: styles.margin4cards,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 4,
        className: styles.margin4cards,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 1370,
      settings: {
        slidesToShow: 3,
        className: styles.margin3cards,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        className: styles.margin2cards,
        slidesToScroll: 1,
        infinite: true
      }
    },
    {
      breakpoint: 610,
      settings: {
        slidesToShow: 1,
        className: styles.margin1cards,
        slidesToScroll: 1,
        infinite: true
      }
    }
  ],
  customPaging: () => <div className={styles.dot} />
};

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};
//className={styles.slider}
interface Props {
  className?: string;
}

export const HotPoolSlider: CFC<Props> = ({ className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassnames = cx(className, modeClass[colorThemeMode], styles.root);

  return (
    <div className={compoundClassnames}>
      <ReactSlider autoplaySpeed={5000} pauseOnHover draggable {...SliderSettings}>
        {children}
      </ReactSlider>
    </div>
  );
};
