import { FC } from 'react';

import cx from 'classnames';

import { useTranslation } from '@translation';

import { OpportunitiesCardsData } from './content';
import s from './opportunities.module.scss';
import { OpportunityCard } from './opportunity-card';
import { Section } from '../section';

interface OpportunitiesProps {
  className?: string;
}

export const Opportunities: FC<OpportunitiesProps> = ({ className }) => {
  const { t } = useTranslation('home');

  return (
    <Section
      className={cx(s.root, className)}
      header={t('home|QuipuSwap opportunities')}
      description={`${t('home|Start to work with the biggest DEX on Tezos: swap, farm, stake.')}`}
      data-test-id="QSOpportunitiesSection"
    >
      <div className={s.cards}>
        {OpportunitiesCardsData.map(({ id, Icon, title, description, button }) => (
          <OpportunityCard
            key={id}
            Icon={Icon}
            title={title}
            description={description}
            button={button}
            id={id}
            data-test-id={`QSOpportunitiesButton-${id}`}
          />
        ))}
      </div>
    </Section>
  );
};
