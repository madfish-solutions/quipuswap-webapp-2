import React, { useContext } from 'react';

import { SliderUI, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Section, responsive } from '@modules/home/components';

import { NewsData } from './content';
import { NewsCard } from './news-card';
import s from './news.module.sass';

interface NewsProps {
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
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
      <SliderUI items={4} className={s.uncenter} responsive={responsive}>
        {NewsData.map(news => (
          <NewsCard key={news.id} className={cx(s.card, modeClass[colorThemeMode])} news={news} />
        ))}
      </SliderUI>
    </Section>
  );
};
