import React from 'react';
import Token from '@icons/Token.svg';

import { useTranslation } from 'next-i18next';
import s from './PopupCell.module.sass';

type PositionCellProps = {
  token1?: any,
  token2?: any,
};
export const PositionCell: React.FC<PositionCellProps> = ({
  token1,
  token2,
}) => {
  const { t } = useTranslation(['common']);
  return (
    <div className={s.positionCell}>
      <div className={s.positionBlockCell}>
        <div className={s.tokenGroup}>
          <Token />
          <Token />
        </div>
        <h6>
          {token1?.name}
          /
          {token2?.name}
        </h6>
      </div>
      <div className={s.positionFlexCell}>
        <div>
          <caption>
            {t('common:LPinVotes')}
            :
          </caption>
          <span className={s.label1}>{token1?.vote}</span>
        </div>
        <div>
          <caption>
            {t('common:LPinVeto')}
            :
          </caption>
          <span className={s.label1}>{token1?.veto}</span>
        </div>
        <div>
          <caption>
            {t('common:TotalBalance')}
            :
          </caption>
          <span className={s.label1}>{token1?.balance}</span>
        </div>
      </div>
    </div>
  );
};
