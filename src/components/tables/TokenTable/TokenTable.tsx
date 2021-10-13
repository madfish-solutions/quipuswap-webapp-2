import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import {
  WhitelistedToken,
} from '@utils/types';
import { Table } from '@components/ui/Table';

import { TokensLogos } from '@components/ui/TokensLogos';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokenCardItem } from './TokenCardItem';

import s from './TokenTable.module.sass';

type TokenTableProps = {
  data: WhitelistedToken[]
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

const farmMobileItem = (token:WhitelistedToken) => (
  <TokenCardItem
    key={`${token.contractAddress}:${token.fa2TokenId}`}
    token={token}
  />
);

export const TokenTable: React.FC<TokenTableProps> = ({
  data,
}) => {
  const { t } = useTranslation(['profile']);
  const [offset, setOffset] = useState(0);

  const { colorThemeMode } = useContext(ColorThemeContext);

  const columns = useMemo(() => [
    {
      Header: t('home|Name'),
      id: 'name',
      accessor: () => (
        <div className={s.links}>
          <TokensLogos
            token1={TEZOS_TOKEN}
            token2={STABLE_TOKEN}
            className={s.tokenLogo}
          />
          <span className={s.cardCellText}>
            {TEZOS_TOKEN.metadata.symbol}
            /
            {STABLE_TOKEN.metadata.symbol}
          </span>
          {/* {isSponsored && (<Bage className={s.bage} text={t('home|Sponsored')} />)} */}
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Your Balance')}
          <Tooltip sizeT="small" content={t('TVL (Total Value Locked) represents the total amount of a specific token locked on QuiuSwap across different pools.')} />
        </div>
      ),
      id: 'balance',
      accessor: () => (
        <div className={s.links}>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
        </div>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Price')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'price',
      accessor: () => (
        <>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
        </>
      ),
    },
    {
      Header: (
        <div className={s.links}>
          {t('home|Total Value')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
      ),
      id: 'totalValue',
      accessor: () => (
        <>
          <span className={s.dollar}>
            $
          </span>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
        </>
      ),
    },
    {
      id: 'poolButton',
      accessor: () => (
        <div className={s.last}>
          <Button
            theme="secondary"
            className={s.button}
            href="#"
            external
          >
            Analytics
          </Button>
          <Button
            href="#"
            className={s.button}
          >
            Trade
          </Button>
        </div>
      ),
    },
    // eslint-disable-next-line
  ], [data, offset, t]);

  return (
    <Table
      theme="pools"
      className={cx(modeClass[colorThemeMode])}
      renderMobile={farmMobileItem}
      data={data}
      columns={columns}
      setOffset={setOffset}
      pageSize={5}
      pageCount={10}
    />
  );
};
