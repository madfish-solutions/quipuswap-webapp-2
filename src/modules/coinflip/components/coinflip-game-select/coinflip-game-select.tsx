import { FC } from 'react';

import { CoinSideAQuipuIcon, CoinSideBIcon } from '@shared/svg';
import { CoinSideATezosIcon } from '@shared/svg/coin/coin-side-a-tezos';

export const CoinflipGameSelect: FC = () => {
  return (
    <>
      <h1>coinflip-game select</h1>

      <CoinSideAQuipuIcon size={64} />
      <CoinSideBIcon size={64} />
      <CoinSideATezosIcon size={64} />
    </>
  );
};
