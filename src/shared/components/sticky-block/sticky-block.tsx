import { FC } from 'react';

import cx from 'classnames';

import s from './sticky-block.module.scss';

export interface StickyBlockProps {
  className?: string;
}

export const StickyBlock: FC<StickyBlockProps> = ({ className, children }) => (
  <div className={cx(s.root, className)}>{children}</div>
);
