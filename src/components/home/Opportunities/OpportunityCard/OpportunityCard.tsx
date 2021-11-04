import React, { ReactNode } from 'react';
import { Button } from '@madfish-solutions/quipu-ui-kit';

import { Card } from '@components/ui/Card';

import s from './OpportunityCard.module.sass';

type OpportunityCardProps = {
  className?: string
  Icon: React.FC<{ className?: string }>
  title: ReactNode
  description: ReactNode
  button: {
    label: ReactNode
    href: string
    external?: boolean
  }
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  className,
  Icon,
  title,
  description,
  button,
}) => (
  <Card className={className} contentClassName={s.content}>
    <Icon className={s.icon} />
    <h3 className={s.title}>{title}</h3>
    <p className={s.description}>{description}</p>
    <Button
      href={button.href}
      external={button.external}
      className={s.button}
    >
      {button.label}
    </Button>
  </Card>
);
