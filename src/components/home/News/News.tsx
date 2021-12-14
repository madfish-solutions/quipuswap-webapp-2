import React, { useContext } from 'react';

import { SliderUI, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { responsive } from '@components/home/News/News.styles';
import { Section } from '@components/home/Section';

import { NewsData } from './content';
import s from './News.module.sass';
import { NewsCard } from './NewsCard';

type NewsProps = {
  className?: string;
};

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
