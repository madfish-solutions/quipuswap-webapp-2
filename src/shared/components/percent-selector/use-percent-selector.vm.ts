import { amplitudeService } from '@shared/services';

export const usePercentSelectorViewModel = () => {
  const logEvent = (percent: number, inputName: string) => {
    amplitudeService.logEvent(`CLICK_PRECENT_SELECTOR`, {
      percent,
      input: inputName
    });
  };

  return { logEvent };
};
