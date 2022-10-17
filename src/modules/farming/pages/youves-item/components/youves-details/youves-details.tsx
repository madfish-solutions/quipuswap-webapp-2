import React from 'react';

import { useYouvesDetailsViewModel } from './use-youves-details.vm';
import { YouvesDetailsView } from './youves-details.view';

export const YouvesDetails = () => {
  const params = useYouvesDetailsViewModel();

  return <YouvesDetailsView {...params} />;
};
