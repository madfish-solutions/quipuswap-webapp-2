import React from 'react';

import {
  PoolTableType,
} from '@utils/types';

type PoolTableProps = {
  data: PoolTableType[]
  loading: boolean
};

export const PoolTable: React.FC<PoolTableProps> = () => (
  // <Table
  //   data={loading ? [1, 2, 3, 4, 5] : data}
  //   renderTableData={loading ? poolTableItemSkeleton : poolTableItem}
  //   renderMobileData={loading ? poolMobileItemSkeleton : poolMobileItem}
  //   header={<Header />}
  // />
  <div />
);
