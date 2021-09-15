import React from 'react';
import cx from 'classnames';

import {
  WhitelistedFarm,
} from '@utils/types';

import { Table } from '@components/ui/Table';
import { TEZOS_TOKEN } from '@utils/defaults';

import s from './PoolTable.module.sass';
import { PoolItem } from './PoolItem';
import { PoolCardItem } from './PoolCardItem';

type PoolTableProps = {
  data: WhitelistedFarm[]
};

const Header = () => (
  <th className={cx(s.tableRow, s.farmRow, s.tableHeader, s.tableHeaderBorder)}>
    <div className={s.label}>
      Name
    </div>
    <div className={s.label}>
      Total staked
    </div>
    <div className={s.label}>
      APR
    </div>
    <div className={s.label} />
  </th>
);

const poolTableItem = (farm:WhitelistedFarm) => {
  const { tokenPair } = farm;
  return (
    <PoolItem
      key={`${tokenPair.token1.contractAddress}_${tokenPair.token1.fa2TokenId}:${tokenPair.token2.contractAddress}_${tokenPair.token2.fa2TokenId}`}
      farm={farm}
      isSponsored={tokenPair.token1.contractAddress === TEZOS_TOKEN.contractAddress}
    />
  );
};

const poolMobileItem = (farm:WhitelistedFarm) => {
  const { tokenPair } = farm;
  return (
    <PoolCardItem
      key={`${tokenPair.token1.contractAddress}_${tokenPair.token1.fa2TokenId}:${tokenPair.token2.contractAddress}_${tokenPair.token2.fa2TokenId}`}
      farm={farm}
      isSponsored={tokenPair.token1.contractAddress === TEZOS_TOKEN.contractAddress}
    />
  );
};

export const PoolTable: React.FC<PoolTableProps> = ({
  data,
}) => (
  <Table
    data={data}
    renderTableData={poolTableItem}
    renderMobileData={poolMobileItem}
    header={<Header />}
  />
);
