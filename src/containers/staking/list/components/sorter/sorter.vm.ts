import { useTranslation } from 'next-i18next';

import { useAuthStore } from '@hooks/stores/use-auth-store';
import { useStakingFilterStore } from '@hooks/stores/use-staking-filter-store';
import { isNull } from '@utils/helpers';

import { SortValue, SortType } from './sorter.types';

export const useSorterViewModel = () => {
  const { t } = useTranslation(['stake']);
  const stakingFilterStore = useStakingFilterStore();
  const { accountPkh } = useAuthStore();

  const onSorterChange = (value: unknown) => {
    return stakingFilterStore.onSorterChange(value as SortValue);
  };

  const sortValues = [
    { label: t('stake|apr'), value: SortType.APR, up: true },
    { label: t('stake|apr'), value: SortType.APR, up: false },
    { label: t('stake|apy'), value: SortType.APY, up: true },
    { label: t('stake|apy'), value: SortType.APY, up: false },
    { label: t('stake|tvl'), value: SortType.TVL, up: true },
    { label: t('stake|tvl'), value: SortType.TVL, up: false }
  ];

  const sortUserValues = [
    { label: t('stake|balance'), value: SortType.BALANCE, up: true },
    { label: t('stake|balance'), value: SortType.BALANCE, up: false },
    { label: t('stake|deposit'), value: SortType.DEPOSIT, up: true },
    { label: t('stake|deposit'), value: SortType.DEPOSIT, up: false },
    { label: t('stake|earned'), value: SortType.EARNED, up: true },
    { label: t('stake|earned'), value: SortType.EARNED, up: false }
  ];

  const sortingValues = isNull(accountPkh) ? sortValues : sortValues.concat(sortUserValues);

  return {
    sortingValues,
    onSorterChange
  };
};
