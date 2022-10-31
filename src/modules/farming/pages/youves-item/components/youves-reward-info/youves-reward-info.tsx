import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useYouvesRewardInfoViewModel } from './use-youves-reward-info.vm';
import { YouvesRewardInfoView } from './youves-reward-info.view';

export const YouvesRewardInfo: FC = observer(() => {
  const params = useYouvesRewardInfoViewModel();

  return <YouvesRewardInfoView {...params} />;
});
