import React from 'react';
import Token from '@icons/Token.svg';

import { useTranslation } from 'next-i18next';
import s from './PopupCell.module.sass';

type BakerCellProps = {
  baker?: any,
};
export const BakerCell: React.FC<BakerCellProps> = ({
  baker,
}) => {
  const { t } = useTranslation(['common']);
  return (
    <div
      className={s.bakerCell}
    >
      <div className={s.bakerFlexCell}>
        <Token />
        <h6>{baker.token}</h6>
      </div>
      <div className={s.bakerFlexCell}>
        <div>
          <caption>
            {t('common:Votes')}
            :
          </caption>
          <span className={s.label1}>{baker.votes}</span>
        </div>
      </div>
      <div className={s.bakerFlexCell}>
        <div className={s.bakerBlock}>
          <div className={s.label1}>
            {t('common:Fee')}
            :
          </div>
          <div className={s.label1}>
            {baker?.fee}
            {' '}
            %
          </div>
        </div>
        <div className={s.bakerBlock}>
          <div className={s.label1}>
            {t('common:Space')}
            :
          </div>
          <span className={s.label1}>{baker?.space}</span>
          <span className={s.bodyTextLink1}>
            {' '}
            {baker?.currency}
          </span>
        </div>

      </div>
    </div>
  );
};
