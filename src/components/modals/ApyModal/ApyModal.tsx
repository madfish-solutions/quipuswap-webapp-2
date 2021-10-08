import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { WhitelistedFarm } from '@utils/types';
import { Modal } from '@components/ui/Modal';

import s from './ApyModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ApyModal: React.FC<{
  isOpen:boolean,
  close:() => void,
  farm?:WhitelistedFarm
}> = ({ isOpen, close, farm }) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <Modal
      containerClassName={cx(themeClass[colorThemeMode], s.modalWrap)}
      contentClassName={s.modal}
      title={t('common|APY')}
      isOpen={isOpen}
      onRequestClose={close}
    >
      <div className={s.header}>
        <div>APR</div>
        <div className={s.headerPercentage}>
          <span className={s.headerBold}>{farm?.apy.toString()}</span>
        </div>
      </div>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr className={s.tableHead}>
            <th className={s.th}>
              Timeframe
            </th>
            <th className={s.th}>
              ROI
            </th>
            <th className={s.th}>
              QUIPU per $ 1,000
            </th>
          </tr>
        </thead>
        <tbody className={cx(s.headerBold, s.tableBody)}>
          <tr>
            <td>
              1D
            </td>
            <td>
              {farm?.daily}
            </td>
            <td>
              {farm?.daily}
            </td>
          </tr>
          <tr>
            <td>
              1W
            </td>
            <td>
              {farm?.daily}
            </td>
            <td>
              {farm?.daily}
            </td>
          </tr>
          <tr>
            <td>
              1M
            </td>
            <td>
              {farm?.daily}
            </td>
            <td>
              {farm?.daily}
            </td>
          </tr>
          <tr>
            <td>
              1Y(APY)
            </td>
            <td>
              {farm?.daily}
            </td>
            <td>
              {farm?.daily}
            </td>
          </tr>
        </tbody>
      </table>
      <div className={s.footer}>
        Calculated based on current rates.
        <br />
        Compounding 1x daily.
        <br />
        All figures are estimates provided for your convenience
        only, and by no means represent guaranteed returns.
      </div>
    </Modal>
  );
};
