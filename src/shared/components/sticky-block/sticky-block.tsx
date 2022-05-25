import cx from 'classnames';

import { CFC } from '@shared/types';

import s from './sticky-block.module.scss';

export interface StickyBlockProps {
  className?: string;
}

export const StickyBlock: CFC<StickyBlockProps> = ({ className, children }) => (
  <div className={cx(s.root, className)}>{children}</div>
);
