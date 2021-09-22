import React from 'react';
import {
  WhitelistedFarm,
} from '@utils/types';

type FarmTableProps = {
  data: WhitelistedFarm[]
  disabled?: boolean
  loading: boolean
};

export const FarmTable: React.FC<FarmTableProps> = () => (
  // <Table
  //   disabled={disabled}
  //   data={data}
  //   renderTableData={farmTableItem}
  //   renderMobileData={farmMobileItem}
  //   header={<Header />}
  // />
  <div />
);
