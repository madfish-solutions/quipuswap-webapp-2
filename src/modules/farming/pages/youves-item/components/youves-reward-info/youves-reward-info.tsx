import { FC } from 'react';

import { useYouvesRewardInfoViewModel } from './use-youves-reward-info.vm';
import { YouvesRewardInfoView } from './youves-reward-info.view';

export const YouvesRewardInfo: FC = () => {
  const params = useYouvesRewardInfoViewModel();

  return <YouvesRewardInfoView {...params} />;
};
