import React, { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useTranslation } from '@shared/hooks';

import { HomeSlider } from '../home-slider';
import { Section } from '../section';
import { NewsData } from './content';
import { NewsCard } from './news-card';
import styles from './news.module.scss';

interface NewsProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const News: React.FC<NewsProps> = ({ className }) => {
  const { t } = useTranslation(['home']);

  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Section
      header={t('home|Our latest news')}
      description={t(
        'home|Never miss important updates. Check what has happened in the QuipuSwap ecosystem recently..'
      )}
      className={cx(className)}
    >
      <HomeSlider className={styles.uncenter}>
        {NewsData.map(news => (
          <NewsCard key={news.id} className={cx(styles.card, modeClass[colorThemeMode])} news={news} />
        ))}
      </HomeSlider>
    </Section>
  );
};
