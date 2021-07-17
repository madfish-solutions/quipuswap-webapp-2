import React from 'react';
import cx from 'classnames';

import s from './StickyBlock.module.sass';

type StickyBlockProps = {
  className?: string
};

export const StickyBlock: React.FC<StickyBlockProps> = ({
  className,
  children,
}) => (
  <div className={cx(s.root, className)}>
    {children}
  </div>
);
