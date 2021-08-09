import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Section } from '@components/home/Section';
import { Card } from '@components/ui/Card';

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
      className={cx(className)}
    >
      <Card contentClassName={s.content}>
        {
          DEXDashboardData.map(({
            id, volume, label, currency, tooltip,
          }, idx) => (
            <DashboardCard
              key={id}
              className={cx(s.card, modeClass[colorThemeMode])}
              size={idx < 4 ? 'extraLarge' : 'large'}
              volume={volume}
              tooltip={tooltip}
              label={label}
              currency={currency}
            />
          ))
        }
      </Card>
    </Section>
  );
};
