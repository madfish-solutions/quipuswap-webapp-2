import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { prettyPrice } from '@utils/helpers';
import { prettyPercentage } from '@utils/helpers/prettyPercentage';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { useAmountOfQuipuPer1000 } from '@hooks/useAmountOfQuipuPer1000';
import { Modal } from '@components/ui/Modal';

import s from './ApyModal.module.sass';

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ApyModal: React.FC<{
  isOpen:boolean,
  close:() => void,
  apr?: BigNumber
  apyDaily?: BigNumber
}> = ({
  isOpen, close, apr, apyDaily,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const amountOfQuipuPer1000 = useAmountOfQuipuPer1000(apr ?? new BigNumber(0), isOpen);
  const [quipuPer1000, setQuipuPer1000] = useState<BigNumber[]>();

  useEffect(() => {
    setQuipuPer1000(amountOfQuipuPer1000);
  }, [amountOfQuipuPer1000]);

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
          <span className={s.headerBold}>
            {apr && prettyPercentage(apr)}
          </span>
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
              {apr && prettyPercentage(apr.dividedBy(365))}
            </td>
            <td>
              {quipuPer1000 && prettyPrice(+quipuPer1000[0].toString(), 2)}
            </td>
          </tr>
          <tr>
            <td>
              1W
            </td>
            <td>
              {apr && prettyPercentage(apr.dividedBy(52))}
            </td>
            <td>
              {quipuPer1000 && prettyPrice(+quipuPer1000[1].toString(), 2)}
            </td>
          </tr>
          <tr>
            <td>
              1M
            </td>
            <td>
              {apr && prettyPercentage(apr.dividedBy(12))}
            </td>
            <td>
              {quipuPer1000 && prettyPrice(+quipuPer1000[2].toString(), 2)}
            </td>
          </tr>
          <tr>
            <td>
              1Y(APY)
            </td>
            <td>
              {apyDaily && prettyPercentage(apyDaily)}
            </td>
            <td>
              {quipuPer1000 && prettyPrice(+quipuPer1000[3].toString(), 2)}
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
