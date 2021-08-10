import React from 'react';
import cx from 'classnames';

import { Skeleton } from '@components/ui/Skeleton';

import s from './ModalCell.module.sass';

export const LoadingBakerCell: React.FC<{}> = () => {
  const compoundClassName = cx(
    s.loading,
    s.listItem,
  );

  return (
    <div className={compoundClassName}>
      <div className={s.bakerFlexCell}>
        <Skeleton className={s.loadingLogo} />
        <Skeleton className={s.loadingName} />
      </div>
      <div className={s.bakerFlexCell}>
        <div className={s.loadingBakerBlock}>
          <Skeleton className={s.loadingCaption} />
          <Skeleton className={s.loadingCaption} />
        </div>
        <div className={s.loadingBakerBlock}>
          <Skeleton className={s.loadingCaption} />
          <Skeleton className={s.loadingCaption} />
        </div>
      </div>
    </div>

  );
};
