import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
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
      header={t('home:Our latest news')}
      description={t('home:Never miss important updates. Check what has happened in the QuickSwap ecosystem recently..')}
      className={cx(className)}
    >
      <SliderUI items={4}>
        {NewsData.map(({ id, sponsored }) => (
          <Card key={id} contentClassName={s.content}>
            <NewsCard
              id={id}
              className={cx(s.card, modeClass[colorThemeMode])}
              sponsored={sponsored}
            />
          </Card>
        ))}
      </SliderUI>

    </Section>
  );
};
