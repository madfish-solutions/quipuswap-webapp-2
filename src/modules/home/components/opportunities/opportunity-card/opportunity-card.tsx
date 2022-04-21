import { FC, ReactNode } from 'react';

import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';
import { amplitudeService } from '@shared/services';

import s from './opportunity-card.module.scss';

interface OpportunityCardProps {
  id: number;
  className?: string;
  Icon: FC<{ className?: string }>;
  title: ReactNode;
  description: ReactNode;
  button: {
    label: ReactNode;
    href?: string;
    disabled?: boolean;
    external?: boolean;
  };
}

export const OpportunityCard: FC<OpportunityCardProps> = ({ id, className, Icon, title, description, button }) => {
  const props = button.href ? { href: button.href, external: button.external } : {};

  const handleOpportunityClick = () => {
    amplitudeService.logEvent('HOME_OPPORTUNITY_CLICK', { id });
  };

  return (
    <Card className={className} contentClassName={s.content}>
      <Icon className={s.icon} />
      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>
      <Button {...props} disabled={!!button.disabled} className={s.button} onClick={handleOpportunityClick}>
        {button.label}
      </Button>
    </Card>
  );
};
