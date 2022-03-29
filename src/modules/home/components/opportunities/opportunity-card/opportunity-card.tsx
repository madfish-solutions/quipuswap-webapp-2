import { FC, ReactNode } from 'react';

import { Card } from '@quipuswap/ui-kit';

import { Button } from '@shared/components/ui';

import s from './opportunity-card.module.sass';

interface OpportunityCardProps {
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

export const OpportunityCard: FC<OpportunityCardProps> = ({ className, Icon, title, description, button }) => {
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
