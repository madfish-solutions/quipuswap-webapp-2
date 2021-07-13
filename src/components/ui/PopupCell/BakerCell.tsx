import React from 'react';
import Token from '@icons/Token.svg';

import s from './PopupCell.module.sass';

type BakerCellProps = {
  baker?: any,
};
export const BakerCell: React.FC<BakerCellProps> = ({
  baker,
}) => (
  <div
    className={s.bakerCell}
  >
    <div className={s.bakerFlexCell}>
      <Token />
      <h6>{baker.token}</h6>
    </div>
    <caption>Votes:</caption>
    <span className={s.label1}>{baker.votes}</span>
    <div className={s.bakerFlexCell}>
      <div className={s.bakerBlock}>
        <div className={s.label1}>Fee:</div>
        <div className={s.label1}>
          {baker?.fee}
          {' '}
          %
        </div>
      </div>
      <div className={s.bakerBlock}>
        <div className={s.label1}>Space</div>
        <span className={s.label1}>{baker?.space}</span>
        <span className={s.bodyTextLink1}>
          {' '}
          {baker?.currency}
        </span>
      </div>

    </div>
  </div>
);
