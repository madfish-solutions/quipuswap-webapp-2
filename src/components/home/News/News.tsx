import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@madfish-solutions/quipu-ui-kit';
import { Section } from '@components/home/Section';
import { Card } from '@components/ui/Card';

import { SliderUI } from '@components/ui/Slider';
import { NewsCard } from './NewsCard';
import { NewsData } from './content';

import s from './News.module.sass';

type NewsProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const News: React.FC<NewsProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);

  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Section
      header={t('home|Our latest news')}
      description={t('home|Never miss important updates. Check what has happened in the QuickSwap ecosystem recently..')}
      className={cx(className)}
    >
      <SliderUI
        items={4}
        className={s.uncenter}
        responsive={[
          {
            breakpoint: 1224,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 700,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              infinite: true,
              dots: true,
            },
          },
          {
            breakpoint: 500,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: true,
            },
          },
        ]}
      >
        {NewsData.map(({ id, sponsored }) => (
          <Card key={id} className={s.root} contentClassName={s.content}>
            <NewsCard
              className={cx(s.card, modeClass[colorThemeMode])}
              sponsored={sponsored}
            />
          </Card>
        ))}
      </SliderUI>

    </Section>
  );
};
