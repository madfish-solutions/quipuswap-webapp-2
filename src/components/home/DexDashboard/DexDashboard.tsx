import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Section } from '@components/home/Section';
import { DashboardCard } from './DashboardCard';
import { DEXDashboardData } from './content';

import s from './DexDashboard.module.sass';

type DexDashboardProps = {
  className?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const DexDashboard: React.FC<DexDashboardProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Section
      header={t('home:DEX Dashboard')}
      description={t('home:The short overview of the most relevant DEX information.')}
      className={cx(className, s.root, modeClass[colorThemeMode])}
    >
      <div className={s.wrapper}>
        <div className={cx(s.primary)}>
          {
            DEXDashboardData.slice(0, 4).map((item) => (
              <DashboardCard
                key={item.id}
                size="large"
                volume={item.volume}
                label={item.label}
                units={item.units}
              />
            ))
          }
        </div>
        <div className={cx(s.secondary)}>
          {DEXDashboardData.slice(4).map((item) => (
            <DashboardCard
              key={item.id}
              size="small"
              volume={item.volume}
              label={item.label}
              units={item.units}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};
