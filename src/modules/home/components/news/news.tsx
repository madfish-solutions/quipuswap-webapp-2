import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useTranslation } from '@translation';

import { NewsData } from './content';
import { NewsCard } from './news-card';
import styles from './news.module.scss';
import { HomeSlider } from '../home-slider';
import { Section } from '../section';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const News: FC = () => {
  const { t } = useTranslation(['home']);

  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Section
      header={t('home|Our latest news')}
      description={t('home|Never miss important updates. Check what has happened in the QuipuSwap ecosystem recently.')}
      data-test-id="newsSection"
    >
      <HomeSlider className={styles.uncenter}>
        {NewsData.map((news, index) => (
          <NewsCard key={news.id} className={cx(styles.card, modeClass[colorThemeMode])} news={news} index={index} />
        ))}
      </HomeSlider>
    </Section>
  );
};
