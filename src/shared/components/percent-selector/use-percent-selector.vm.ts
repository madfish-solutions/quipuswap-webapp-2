import { useLocation } from 'react-router-dom';

import { determineCurrentPageName } from '@shared/helpers';
import { useAmplitudeService } from '@shared/hooks';

export const usePercentSelectorViewModel = () => {
  const location = useLocation();
  const { log } = useAmplitudeService();

  const pageName = determineCurrentPageName(location).toUpperCase();

  const handleLogEvent = (percentValue: number) => {
    log(`CLICK_${pageName}_${percentValue}_PERCENT`);
  };

  return { handleLogEvent };
};
