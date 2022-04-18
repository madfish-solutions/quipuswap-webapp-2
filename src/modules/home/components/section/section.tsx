import { FC } from 'react';

import cx from 'classnames';

import { QSOpportunitiesAttributes } from '@tests/types';

import s from './section.module.scss';

export interface SectionProps extends Pick<QSOpportunitiesAttributes, 'quipuswapOpportunitiesTitleTestId'> {
  header: string;
  description: string;
  className?: string;
}

export const Section: FC<SectionProps> = ({
  header,
  description,
  className,
  children,
  quipuswapOpportunitiesTitleTestId
}) => (
  <section className={cx(s.root, className)}>
    <h2 className={s.header} data-test-id={quipuswapOpportunitiesTitleTestId}>
      {header}
    </h2>
    <p className={s.description}>{description}</p>
    {children}
  </section>
);
