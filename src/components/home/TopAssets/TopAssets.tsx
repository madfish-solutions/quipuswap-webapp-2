import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';
import { Section, SectionProps } from '@components/home/Section';
import { TopAssetsCard } from '@components/home/TopAssets/TopAssetsCard';

import s from './TopAssets.module.sass';

type TopAssetsProps = Omit<SectionProps, 'className'> & {
  // data: Omit<TopAssetsCardProps, 'className'>[]
  data: any
  button: {
    label: string
    href: string
    external?: boolean
  }
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TopAssets: React.FC<TopAssetsProps> = ({
  header,
  description,
  data,
  button,
  className,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Section
      header={header}
      description={description}
      className={className}
    >
      <div className={cx(s.cards, modeClass[colorThemeMode])}>
        {data.map((item:any) => (
          <TopAssetsCard
            key={item.id}
            {...item}
            className={s.card}
          />
        ))}
      </div>
      <Button
        theme="inverse"
        href={button.href}
        external={button.external}
        className={s.button}
      >
        {button.label}
      </Button>
    </Section>
  );
};
