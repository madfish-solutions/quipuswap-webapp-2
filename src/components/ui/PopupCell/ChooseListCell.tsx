import React from 'react';
import Token from '@icons/Token.svg';

import s from './PopupCell.module.sass';

type ChooseListCellProps = {
  token?: any,
};
export const ChooseListCell: React.FC<ChooseListCellProps> = ({
  token,
}) => (
  <div
    className={s.tokenCell}
  >
    <Token />
    <div className={s.popupCellBlock}>
      <h6>
        {token?.name}
      </h6>
      <caption>
        {token?.label}
      </caption>
    </div>
  </div>
);
