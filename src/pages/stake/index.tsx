import React, { FC } from 'react';

import { BaseLayout } from '@components/common/BaseLayout';
import { Stake } from '@containers/stake';

const StakePage: FC = () => {
  return (
    <BaseLayout>
      <Stake />
    </BaseLayout>
  );
};

// eslint-disable-next-line import/no-default-export
export default StakePage;
