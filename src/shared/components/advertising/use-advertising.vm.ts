import { useAmplitudeService } from '@shared/hooks';

export const useAdvertisingViewModel = () => {
  const { log } = useAmplitudeService();

  const handleLogEvent = () => {
    log('CLICK_YUPANA_BANNER');
  };

  return { handleLogEvent };
};
