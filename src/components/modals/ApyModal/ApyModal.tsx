import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Modal } from '@components/ui/Modal';

import s from './ApyModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ApyModal: React.FC<{ isOpen:boolean, close:() => void }> = ({ isOpen, close }) => {
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
          <span className={s.headerBold}>52.99</span>
          {' '}
          %
        </div>
      </div>
      <table className={s.table}>
        <thead className={s.thead}>
          <tr className={s.tableHead}>
            <th>
              Timeframe
            </th>
            <th>
              ROI
            </th>
            <th>
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
              0.14%
            </td>
            <td>
              0.08
            </td>
          </tr>
          <tr>
            <td>
              1W
            </td>
            <td>
              0.97%
            </td>
            <td>
              0.64
            </td>
          </tr>
          <tr>
            <td>
              1M
            </td>
            <td>
              4.32%
            </td>
            <td>
              2.56
            </td>
          </tr>
          <tr>
            <td>
              1Y(APY)
            </td>
            <td>
              65%
            </td>
            <td>
              64
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
