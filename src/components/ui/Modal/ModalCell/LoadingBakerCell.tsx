import React from 'react';
import cx from 'classnames';
import { Skeleton } from '@madfish-solutions/quipu-ui-kit';

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
        <Skeleton className={cx(s.loadingName, s.loadingNameBaker)} />
      </div>
      <div className={s.bakerFlexCell}>
        <div className={s.loadingBakerBlock}>
          <Skeleton className={cx(s.loadingCaption, s.loadingCaptionSmall)} />
          <Skeleton className={cx(s.loadingCaption, s.loadingCaptionSmall)} />
        </div>
        <div className={s.loadingBakerBlock}>
          <Skeleton className={s.loadingCaption} />
          <Skeleton className={s.loadingCaption} />
        </div>
      </div>
    </div>

  );
};
