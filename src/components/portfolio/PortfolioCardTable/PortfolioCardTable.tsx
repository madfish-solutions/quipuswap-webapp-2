import React, { useContext, useMemo, useState } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { MAX_ITEMS_PER_PAGE_MOBILE } from '@utils/defaults';
import {
  WhitelistedToken, TransactionType, WhitelistedFarm, WhitelistedTokenPair,
} from '@utils/types';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import s from './PortfolioCardTable.module.sass';

type PortfolioCardTableProps = {
  outerHeader?: boolean
  header: string[]
  label: string
  href?: string
  data: WhitelistedToken[] | WhitelistedFarm[] | WhitelistedTokenPair[] | TransactionType[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PortfolioCardTable: React.FC<PortfolioCardTableProps> = ({
  outerHeader = false,
  header,
  label,
  children,
  href = '#',
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [page, setPage] = useState<number>(1);
  const childrenCount = children && Array.isArray(children) ? children.length : 0;
  const pageMax = useMemo(
    () => Math.ceil(childrenCount / MAX_ITEMS_PER_PAGE_MOBILE), [childrenCount],
  );
  const startIndex = (page - 1) * MAX_ITEMS_PER_PAGE_MOBILE;
  const endIndex = Math.min(startIndex + MAX_ITEMS_PER_PAGE_MOBILE - 1, childrenCount - 1);
  const renderChildren = Array.isArray(children)
    ? children.slice(startIndex, endIndex)
    : [children];

  return (
    <>
      {outerHeader && (
      <h1 className={s.h1}>
        {label}
      </h1>
      )}
      <Card
        className={cx(s.portfolioCard, themeClass[colorThemeMode])}
      >
        {!outerHeader && (
        <CardHeader
          header={{
            content: (
              <Button
                href="/portfolio"
                theme="quaternary"
                className={s.proposalHeader}
                control={
                  <Back className={s.proposalBackIcon} />
                }
              >
                Back
              </Button>),
          }}
        />
        )}
        {!outerHeader && (<CardHeader header={{ content: <h2 className={s.h2}>{label}</h2> }} />)}
        {outerHeader && (
        <CardHeader
          header={{ content: '', button: <Button href={href} theme="inverse">View All</Button> }}
          className={s.header}
        />
        )}
        <CardContent>
          <div className={s.container}>
            <div className={s.wrapper}>
              <div className={s.innerWrapper}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th className={cx(s.tableRow, s.poolRow, s.tableHeader)}>
                        {header.map((x) => (
                          <div key={x} className={s.label}>
                            {x}
                          </div>
                        ))}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderChildren}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={s.cardCellSmall}>
            <div className={s.footer}>
              <Button
                onClick={() => setPage(page - 1)}
                theme="quaternary"
                disabled={page < 2}
              >
                {page !== 1 ? (<Back />) : <DisabledBack />}
              </Button>
              <div className={s.pagination}>
                Page
                <span className={s.paginationPage}>{page}</span>
                of
                <span className={s.paginationPage}>{pageMax}</span>
              </div>
              <Button
                onClick={() => setPage(page + 1)}
                theme="quaternary"
                disabled={page > pageMax - 1}
              >
                {page < (pageMax)
                  ? (<Back id="PortfolioCard" className={s.forward} />)
                  : <DisabledBack className={s.forward} />}
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
