import React from 'react';

import cx from 'classnames';

import { appi18n } from '@app.i18n';
import { Section } from '@components/home/Section';

import { OpportunitiesCardsData } from './content';
import s from './Opportunities.module.sass';
import { OpportunityCard } from './OpportunityCard';

interface OpportunitiesProps {
  className?: string;
}

export const Opportunities: React.FC<OpportunitiesProps> = ({ className }) => {
  const { t } = appi18n;

  return (
    <Section
      className={cx(s.root, className)}
      header={t('QuipuSwap opportunities')}
      description={`${t('home|Start to work with the biggest DEX on Tezos: swap, farm, stake.')}`}
    >
      <div className={s.cards}>
        {OpportunitiesCardsData.map(({ id, Icon, title, description, button }) => (
          <OpportunityCard key={id} Icon={Icon} title={title} description={description} button={button} />
        ))}
      </div>
    </Section>
  );
};
