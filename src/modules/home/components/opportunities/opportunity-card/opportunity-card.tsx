import { FC, ReactNode } from 'react';

import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';
import { DataTestAttribute } from '@tests/types';

import s from './opportunity-card.module.scss';

interface OpportunityCardProps extends DataTestAttribute {
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

export const OpportunityCard: FC<OpportunityCardProps> = ({ className, Icon, title, description, button, testId }) => {
  const props = button.href ? { href: button.href, external: button.external } : {};

  return (
    <Card className={className} contentClassName={s.content}>
      <Icon className={s.icon} />
      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>
      <Button {...props} disabled={!!button.disabled} className={s.button} testId={testId}>
        {button.label}
      </Button>
    </Card>
  );
};
