import React from 'react';
import cx from 'classnames';

import s from './Section.module.sass';

type SectionProps = {
  header?: string
  className?: string
};

export const Section: React.FC<SectionProps> = ({
  header,
  className,
  children,
}) => (
  <section className={cx(s.root, className)}>
    {header && (<h2 className={s.header}>{header}</h2>)}
    {children}
  </section>
);
