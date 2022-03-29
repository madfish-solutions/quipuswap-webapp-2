import { FC } from 'react';

import cx from 'classnames';

import s from './section.module.sass';

export interface SectionProps {
  header: string;
  description: string;
  className?: string;
}

export const Section: FC<SectionProps> = ({ header, description, className, children }) => (
  <section className={cx(s.root, className)}>
    <h2 className={s.header}>{header}</h2>
    <p className={s.description}>{description}</p>
    {children}
  </section>
);
