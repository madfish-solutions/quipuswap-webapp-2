import React, { useContext, useMemo, useState } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  WhitelistedFarm,
} from '@utils/types';
import { MAX_ITEMS_PER_PAGE } from '@utils/defaults';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { FarmItem } from '@components/portfolio/PortfolioTable/PortfolioItem';
import { Button } from '@components/ui/Button';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import s from './PortfolioTable.module.sass';

type FarmTableProps = {
  outerHeader?: boolean
  header: string
  data: WhitelistedFarm[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const FarmTable: React.FC<FarmTableProps> = ({
  outerHeader = false,
  header,
  data,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [page, setPage] = useState<number>(1);
  const pageMax = useMemo(() => Math.ceil(data.length / MAX_ITEMS_PER_PAGE), [data.length]);
  const startIndex = (page - 1) * MAX_ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + MAX_ITEMS_PER_PAGE - 1, data.length - 1);

  return (
    <>
      {outerHeader && (
      <h1 className={s.h1}>
        {header}
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
                theme="quaternary"
                className={s.proposalHeader}
                href="/portfolio"
                control={
                  <Back className={s.proposalBackIcon} />
                }
              >
                Back
              </Button>),
          }}
        />
        )}
        {!outerHeader && (<CardHeader header={{ content: <h2 className={s.h2}>{header}</h2> }} />)}
        {outerHeader && (
        <CardHeader
          header={{ content: '', button: <Button href="/portfolio/farms" theme="inverse">View All</Button> }}
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
                      <th className={cx(s.tableRow, s.farmRow, s.tableHeader)}>
                        <div className={s.label}>
                          Name
                        </div>
                        <div className={s.label}>
                          Your Balance
                        </div>
                        <div className={s.label}>
                          Price
                        </div>
                        <div className={s.label}>
                          Total Value
                        </div>
                        <div className={s.label} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(startIndex, endIndex).map((farm) => (
                      <FarmItem
                        key={`${farm.tokenPair.token1.contractAddress}_${farm.tokenPair.token1.fa2TokenId}:${farm.tokenPair.token2.contractAddress}_${farm.tokenPair.token2.fa2TokenId}`}
                        farm={farm}
                      />
                    ))}
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
                  ? (<Back className={s.forward} />)
                  : <DisabledBack className={s.forward} />}
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
