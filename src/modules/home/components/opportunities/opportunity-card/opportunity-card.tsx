import { FC, ReactNode } from 'react';

import { Button } from '@shared/components/button';
import { Card } from '@shared/components/card';

import s from './opportunity-card.module.scss';

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

export const OpportunityCard: FC<OpportunityCardProps> = ({
  className,
  Icon,
  title,
  description,
  button,
  ...props
}) => {
  const buttonProps = button.href ? { href: button.href, external: button.external } : {};
  //

  return (
    <Card className={className} contentClassName={s.content} data-test-id="QSOpportunityCard">
      <Icon className={s.icon} />
      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>
      <Button {...buttonProps} disabled={!!button.disabled} className={s.button} {...props}>
        {button.label}
      </Button>
    </Card>
  );
};
