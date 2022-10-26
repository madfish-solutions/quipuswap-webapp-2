import { useContext } from 'react';

import cx from 'classnames';
import ReactSlider from 'react-slick';

import { FISRT_INDEX } from '@config/constants';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CFC } from '@shared/types';

import styles from './hot-pool-slider.module.scss';

const MAX_SLIDES_TO_SHOW = 4;

const SliderSettings = {
  slidesToShow: MAX_SLIDES_TO_SHOW,
  slidesToScroll: 1,
  infinite: true,
  arrows: false,
  className: styles.margin4cards,
  responsive: [
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: MAX_SLIDES_TO_SHOW,
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

interface Props {
  poolsCount: number;
  className?: string;
}

export const HotPoolSlider: CFC<Props> = ({ poolsCount, className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassnames = cx(className, modeClass[colorThemeMode], styles.root);

  if (poolsCount < MAX_SLIDES_TO_SHOW) {
    SliderSettings.slidesToShow = poolsCount;
    SliderSettings.responsive[FISRT_INDEX].settings.slidesToShow = poolsCount;
  } else {
    SliderSettings.slidesToShow = MAX_SLIDES_TO_SHOW;
    SliderSettings.responsive[FISRT_INDEX].settings.slidesToShow = MAX_SLIDES_TO_SHOW;
  }

  return (
    <div className={compoundClassnames}>
      <ReactSlider autoplay autoplaySpeed={5000} pauseOnHover draggable {...SliderSettings}>
        {children}
      </ReactSlider>
    </div>
  );
};
