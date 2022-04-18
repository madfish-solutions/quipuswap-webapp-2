import { FC } from 'react';

import cx from 'classnames';

import { QSOpportunitiesTitle } from '@tests/home';
import { useTranslation } from '@translation';

import { Section } from '../section';
import { OpportunitiesCardsData } from './content';
import s from './opportunities.module.scss';
import { OpportunityCard } from './opportunity-card';

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
      quipuswapOpportunitiesTitleTestId={QSOpportunitiesTitle.QUIPUSWAP_OPPORTUNITIES_TITLE}
    >
      <div className={s.cards}>
        {OpportunitiesCardsData.map(({ id, Icon, title, description, button, testId }) => (
          <OpportunityCard
            key={id}
            Icon={Icon}
            title={title}
            description={description}
            button={button}
            testId={testId}
          />
        ))}
      </div>
    </Section>
  );
};
