import React from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { Section } from '@components/home/Section';

import { OpportunityCard } from './OpportunityCard';
import { OpportunitiesCardsData } from './content';
import s from './Opportunities.module.sass';

type OpportunitiesProps = {
  className?: string
};

export const Opportunities: React.FC<OpportunitiesProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);

  return (
    <Section
      className={cx(s.root, className)}
      header={t('home:QuipuSwap opportunities')}
      description={`${t('home:Start to work with the biggest DEX on Tezos')}: ${t('home:swap, farm, stake.')}`}
    >
      <div className={s.cards}>
        {
          OpportunitiesCardsData.map(({
            id, Icon, title, description, button,
          }) => (
            <OpportunityCard
              key={id}
              Icon={Icon}
              title={title}
              description={description}
              button={button}
            />
          ))
        }
      </div>
    </Section>
  );
};
