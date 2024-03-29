import cx from 'classnames';

import { CFC } from '@shared/types';

import s from './section.module.scss';

export interface SectionProps {
  header: string;
  description: string;
  className?: string;
}

export const Section: CFC<SectionProps> = ({ header, description, className, children, ...props }) => (
  <section className={cx(s.root, className)} {...props}>
    <h2 className={s.header} data-test-id="sectionHeader">
      {header}
    </h2>
    <p className={s.description}>{description}</p>
    {children}
  </section>
);
