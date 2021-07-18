import React from 'react';
import cx from 'classnames';

import s from './Section.module.sass';

type SectionProps = {
  header: string
  description: string
  className?: string
};

export const Section: React.FC<SectionProps> = ({
  header,
  description,
  className,
  children,
}) => (
  <section className={cx(s.root, className)}>
    <h2 className={s.header}>{header}</h2>
    <p className={s.description}>{description}</p>
    {children}
  </section>
);
