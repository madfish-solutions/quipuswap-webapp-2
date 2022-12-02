import { observer } from 'mobx-react-lite';

import { useYouvesDetailsViewModel } from './use-youves-details.vm';
import { YouvesDetailsView } from './youves-details.view';

export const YouvesDetails = observer(() => {
  const params = useYouvesDetailsViewModel();

  return <YouvesDetailsView {...params} />;
});
