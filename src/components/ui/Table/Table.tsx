import React, {
  useContext, useMemo, useState,
} from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { MAX_ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE_MOBILE } from '@utils/defaults';
import { Card, CardContent } from '@components/ui/Card';
import { Pagination } from '@components/ui/Pagination';

import s from './Table.module.sass';

type TableCardProps = {
  data: any
  renderData: any
  itemsPerPage: number
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TableCard: React.FC<TableCardProps> = ({
  data,
  renderData,
  itemsPerPage,
}) => {
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
        <CardContent>
          {data.slice(startIndex, endIndex).map(renderData)}
          <Pagination page={page} pageMax={pageMax} setPage={setPage} />
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
};

const TableInner: React.FC<RealTableProps> = ({
  data,
  renderData,
  header,
  itemsPerPage,
}) => {
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
        <CardContent>
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
          <Pagination page={page} pageMax={pageMax} setPage={setPage} />
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
};

export const Table: React.FC<TableProps> = ({
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
        data={data}
        renderData={renderTableData}
        header={header}
        itemsPerPage={itemsPerPage}
      />
    </div>
    <div className={s.mobile}>
      <TableCard
        data={data}
        renderData={renderMobileData}
        itemsPerPage={itemsPerPageMobile}
      />
    </div>
  </>
);
