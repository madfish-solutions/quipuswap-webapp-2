import React from 'react';

import { BaseLayout } from '@components/common/BaseLayout';
import { StakeItem } from '@containers/stake';

const StakeItemPage = () => {
  return (
    <BaseLayout>
      <StakeItem />
    </BaseLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default StakeItemPage;
