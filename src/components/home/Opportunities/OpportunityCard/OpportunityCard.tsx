import React, { ReactNode, useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { Button } from '@components/ui/Button';

import s from './OpportunityCard.module.sass';

type OpportunityCardProps = {
  className?: string
  Icon: React.FC<{ className?: string }>
  title: ReactNode
  description: ReactNode
  button: {
    label: string
    href: string
    external?: boolean
  }
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  className,
  Icon,
  title,
  description,
  button,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    className,
  );

  return (
    <div className={compoundClassName}>
      <Icon className={s.center} />
      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>
      <Button
        href={button.href}
        external={button.external}
        className={s.button}
      >
        {button.label}
      </Button>
    </div>
  );
};
