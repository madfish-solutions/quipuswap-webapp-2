import React, { ReactNode } from 'react';

import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

import s from './OpportunityCard.module.sass';

type OpportunityCardProps = {
  className?: string
  Icon: React.FC<{ className?: string }>
  title: ReactNode
  description: ReactNode
  button: {
    label: ReactNode
    href?: string
    external?: boolean
    disabled?: boolean
  }
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  className,
  Icon,
  title,
  description,
  button,
}) => {
  const {
    disabled = false, href, label, external = false,
  } = button;
  return (
    <Card className={className} contentClassName={s.content}>
      <Icon className={s.icon} />
      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>
      <Button
        href={href}
        external={external}
        className={s.button}
        disabled={disabled}
      >
        {label}
      </Button>
    </Card>
  );
};
