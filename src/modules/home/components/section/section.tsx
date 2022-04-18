import { FC } from 'react';

import cx from 'classnames';

import { DataTestAttribute } from '@tests/types';

import s from './section.module.scss';

export interface SectionProps extends DataTestAttribute {
  header: string;
  description: string;
  className?: string;
}

export const Section: FC<SectionProps> = ({ header, description, className, testId, children }) => (
  <section className={cx(s.root, className)} data-test-id={testId}>
    <h2 className={s.header} data-test-id="header">
      {header}
    </h2>
    <p className={s.description}>{description}</p>
    {children}
  </section>
);
