import React, { useContext, useMemo, useState } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import {
  WhitelistedFarm,
} from '@utils/types';
import { MAX_ITEMS_PER_PAGE_MOBILE, TEZOS_TOKEN } from '@utils/defaults';
import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Back } from '@components/svg/Back';
import DisabledBack from '@icons/DisabledBack.svg';

import s from './PoolCardTable.module.sass';
import { PoolMobileItem } from './PoolMobileItem';

type PoolCardTableProps = {
  data: WhitelistedFarm[]
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const PoolCardTable: React.FC<PoolCardTableProps> = ({
  data,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [page, setPage] = useState<number>(1);
  const pageMax = useMemo(() => Math.ceil(data.length / MAX_ITEMS_PER_PAGE_MOBILE), [data.length]);
  const startIndex = (page - 1) * MAX_ITEMS_PER_PAGE_MOBILE;
  const endIndex = Math.min(startIndex + MAX_ITEMS_PER_PAGE_MOBILE - 1, data.length - 1);

  return (
    <>
      <Card
        isV2
        className={cx(s.portfolioCard, themeClass[colorThemeMode])}
      >
        <CardContent>
          {data.slice(startIndex, endIndex).map((farm) => (
            <PoolMobileItem
              key={`${farm.tokenPair.token1.contractAddress}_${farm.tokenPair.token1.fa2TokenId}:${farm.tokenPair.token2.contractAddress}_${farm.tokenPair.token2.fa2TokenId}`}
              farm={farm}
              isSponsored={
                farm.tokenPair.token1.contractAddress === TEZOS_TOKEN.contractAddress
              }
            />
          ))}
          <div className={s.cardCellSmall}>
            <div className={s.footer}>
              <Button
                onClick={() => setPage(page - 1)}
                theme="quaternary"
                disabled={page < 2}
              >
                {page !== 1 ? (<Back id="PoolCard_b" />) : <DisabledBack />}
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
                  ? (<Back id="PoolCard" className={s.forward} />)
                  : <DisabledBack className={s.forward} />}
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
