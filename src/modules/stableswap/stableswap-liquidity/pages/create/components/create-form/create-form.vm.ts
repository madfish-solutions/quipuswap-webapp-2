import { i18n } from '@translation';

export const useCreateFormViewModel = () => {
  const radioButtonValues = [
    {
      radioName: 'content',
      value: '10',
      label: i18n.t('stableswap|amplification10')
    },
    {
      radioName: 'content',
      value: '100',
      label: i18n.t('stableswap|amplification100')
    },
    {
      radioName: 'content',
      value: '200',
      label: i18n.t('stableswap|amplification200')
    }
  ];

  const creationCost = {
    burned: '20',
    devFee: '1200',
    total: '1220'
  };

  return {
    creationCost,
    radioButtonValues,
    handleSubmit: (e: unknown) => e
  };
};
