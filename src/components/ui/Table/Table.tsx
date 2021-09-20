import React, {
  useContext, useMemo, useState,
} from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { MAX_ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE_MOBILE } from '@utils/defaults';
import { Card, CardContent } from '@components/ui/Card';
import { Pagination } from '@components/ui/Pagination';

import s from './Table.module.sass';

type TableCardProps = {
  data: any
  renderData: any
  itemsPerPage: number
  disabled: boolean
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TableCard: React.FC<TableCardProps> = ({
  data,
  renderData,
  itemsPerPage,
  disabled,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [page, setPage] = useState<number>(1);
  const pageMax = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length]);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, data.length - 1);

  return (
    <>
      <Card
        isV2
        className={cx(themeClass[colorThemeMode])}
      >
        <CardContent className={s.card}>
          {data.slice(startIndex, endIndex).map(renderData)}
          {disabled && (
          <div className={s.disabled}>
            <div className={s.disabledBg} />
            <h1 className={s.h1}>{t('common:Coming soon!')}</h1>
          </div>
          )}
          {!disabled && <Pagination page={page} pageMax={pageMax} setPage={setPage} />}
        </CardContent>
      </Card>
    </>
  );
};

type RealTableProps = {
  data: any
  renderData: any
  header: any
  itemsPerPage: number
  disabled: boolean
};

const TableInner: React.FC<RealTableProps> = ({
  data,
  renderData,
  header,
  itemsPerPage,
  disabled,
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [page, setPage] = useState<number>(1);
  const pageMax = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length]);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, data.length - 1);

  return (
    <>
      <Card
        isV2
        className={cx(themeClass[colorThemeMode])}
      >
        <CardContent className={s.card}>
          <div className={s.container}>
            <div className={s.wrapper}>
              <div className={s.innerWrapper}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      {header}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(startIndex, endIndex).map(renderData)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {disabled && (
          <div className={s.disabled}>
            <div className={s.disabledBg} />
            <h1 className={s.h1}>{t('common:Coming soon!')}</h1>
          </div>
          )}
          {!disabled && <Pagination page={page} pageMax={pageMax} setPage={setPage} />}
        </CardContent>
      </Card>
    </>
  );
};

type TableProps = {
  data: any
  renderTableData: any
  renderMobileData: any
  header: any,
  className?: string
  itemsPerPage?: number
  itemsPerPageMobile?: number
  disabled?: boolean
};

export const Table: React.FC<TableProps> = ({
  disabled = false,
  header,
  renderTableData,
  renderMobileData,
  data,
  itemsPerPage = MAX_ITEMS_PER_PAGE,
  itemsPerPageMobile = MAX_ITEMS_PER_PAGE_MOBILE,
}) => (
  <>
    <div className={s.notMobile}>
      <TableInner
        disabled={disabled}
        data={data}
        renderData={renderTableData}
        header={header}
        itemsPerPage={itemsPerPage}
      />
    </div>
    <div className={s.mobile}>
      <TableCard
        disabled={disabled}
        data={data}
        renderData={renderMobileData}
        itemsPerPage={itemsPerPageMobile}
      />
    </div>
  </>
);
