import { useEffect, useState } from 'react';

import { FarmsType } from '@utils/types';
import { FARMS_INFO_ENDPOINT } from '@utils/defaults';

export const useFarms = () => {
  const [farms, setFarms] = useState<FarmsType[]>();
  useEffect(() => {
    const loadFarms = async () => {
      fetch(FARMS_INFO_ENDPOINT)
        .then((response) => response.json())
        .then((result) => setFarms(result));
    };

    loadFarms();
  }, []);

  return farms;
};
