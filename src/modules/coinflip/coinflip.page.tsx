import { FC } from 'react';

import { PageTitle, TestnetAlert } from '@shared/components';
import { CoinSideAQuipuIcon, CoinSideBIcon } from '@shared/svg';
import { CoinSideATezosIcon } from '@shared/svg/coin/coin-side-a-tezos';

export const CoinflipPage: FC = () => {
  return (
    <>
      <TestnetAlert />
      <PageTitle>Game</PageTitle>
      <CoinSideAQuipuIcon size={64} />
      <CoinSideBIcon size={64} />
      <CoinSideATezosIcon size={64} />
    </>
  );
};
