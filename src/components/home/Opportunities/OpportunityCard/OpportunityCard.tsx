import React, { ReactNode } from 'react';

import { Button, Card } from '@quipuswap/ui-kit';

import s from './OpportunityCard.module.sass';

type OpportunityCardProps = {
  className?: string;
  Icon: React.FC<{ className?: string }>;
  title: ReactNode;
  description: ReactNode;
  button: {
    label: ReactNode;
    href?: string;
    disabled?: boolean;
    external?: boolean;
  };
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ className, Icon, title, description, button }) => {
  const props = button.href ? { href: button.href, external: button.external } : {};

  return (
    <Card className={className} contentClassName={s.content}>
      <Icon className={s.icon} />
      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>
      <Button {...props} disabled={!!button.disabled} className={s.button}>
        {button.label}
      </Button>
    </Card>
  );
};
