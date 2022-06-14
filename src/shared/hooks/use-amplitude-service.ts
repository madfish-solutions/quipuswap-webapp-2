import { useDebouncedCallback } from 'use-debounce';

import { amplitudeService } from '../services';

const DEBOUNCE_LOG = 3000;

export const useAmplitudeService = () => {
  const log = amplitudeService.logEvent.bind(amplitudeService);

  const debounceLog = useDebouncedCallback(amplitudeService.logEvent.bind(amplitudeService), DEBOUNCE_LOG);

  return { log, debounceLog };
};
