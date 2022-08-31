import { noopMap } from '@shared/mapping';
import { useTranslation } from '@translation';

export const useNewLiquidityCreatePageViewModel = () => {
  const { t } = useTranslation();

  const handleSubmit = () => noopMap;

  const data = [
    {
      value: '',
      label: t('common|Input'),
      onInputChange: noopMap
    },
    {
      value: '',
      label: t('common|Input'),
      onInputChange: noopMap
    }
  ];

  const bakerData = {
    value: '',
    error: '',
    handleChange: noopMap,
    shouldShowBakerInput: true
  };

  return { data, bakerData, handleSubmit };
};
