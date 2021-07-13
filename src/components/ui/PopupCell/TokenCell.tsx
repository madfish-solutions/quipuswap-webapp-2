import React from 'react';
import Token from '@icons/Token.svg';
import { Bage } from '../Bage';

import s from './PopupCell.module.sass';

type TokenCellProps = {
  token?: any,
};
export const TokenCell: React.FC<TokenCellProps> = ({
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
    {token?.badges.map((x:any) => <Bage key={x} text={x} />) }
  </div>
);
