import React from 'react';
import cx from 'classnames';

import {
  WhitelistedFarm,
} from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';

import { Table } from '@components/ui/Table';
import s from './FarmTable.module.sass';
import { FarmItem } from './FarmItem';
import { FarmCardItem } from './FarmCardItem';

type FarmTableProps = {
  data: WhitelistedFarm[]
};

const Header = () => (
  <th className={cx(s.tableRow, s.farmRow, s.tableHeader, s.tableHeaderBorder)}>
    <div className={s.label}>
      Name
    </div>
    <div className={s.label}>
      TVL
    </div>
    <div className={s.label}>
      Volume 24h
    </div>
    <div className={s.label} />
  </th>
);

const farmTableItem = (farm:WhitelistedFarm) => {
  const { tokenPair } = farm;
  return (
    <FarmItem
      key={`${tokenPair.token1.contractAddress}_${tokenPair.token1.fa2TokenId}:${tokenPair.token2.contractAddress}_${tokenPair.token2.fa2TokenId}`}
      farm={farm}
      isSponsored={
      tokenPair.token1.contractAddress === TEZOS_TOKEN.contractAddress
    }
    />
  );
};

const farmMobileItem = (farm:WhitelistedFarm) => {
  const { tokenPair } = farm;
  return (
    <FarmCardItem
      key={`${tokenPair.token1.contractAddress}_${tokenPair.token1.fa2TokenId}:${tokenPair.token2.contractAddress}_${tokenPair.token2.fa2TokenId}`}
      farm={farm}
      isSponsored={
      tokenPair.token1.contractAddress === TEZOS_TOKEN.contractAddress
    }
    />
  );
};

export const FarmTable: React.FC<FarmTableProps> = ({
  data,
}) => (
  <Table
    data={data}
    renderTableData={farmTableItem}
    renderMobileData={farmMobileItem}
    header={<Header />}
  />
);
