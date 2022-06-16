import { FormEvent } from 'react';

import cx from 'classnames';

import { isNull } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useStableswapFilterStore } from '../../../../../hooks';
import styles from './list-filter.module.scss';

export const useListFilterViewModel = () => {
  const { t } = useTranslation();
  const stableswapFilterStore = useStableswapFilterStore();

  const { search, tokenIdValue, whitelistedOnly } = stableswapFilterStore;

  const setWhitelistedOnly = (state: boolean) => {
    return stableswapFilterStore.setWhitelistedOnly(state);
  };

  const onSearchChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e)) {
      return;
    }
    stableswapFilterStore.onSearchChange((e.target as HTMLInputElement).value);
  };

  const onTokenIdChange = (e: FormEvent<HTMLInputElement>) => {
    if (isNull(e) || isNull(e.target)) {
      return;
    }
    stableswapFilterStore.onTokenIdChange((e.target as HTMLInputElement).value);
  };

  const handleIncrement = () => {
    stableswapFilterStore.handleIncrement();
  };

  const handleDecrement = () => {
    stableswapFilterStore.handleDecrement();
  };

  const switcherData = [
    {
      value: whitelistedOnly,
      onClick: setWhitelistedOnly,
      translation: t('stableswap|Whitelisted Only'),
      translationClassName: styles.switcherTranslation,
      className: cx(styles.switcherContainer, styles.switcherWhitelistedOnly)
    }
  ];

  const translation = {
    inputPlaceholderTranslation: t('common|Search'),
    numberInputPlaceholderTranslation: t('common|Token ID')
  };

  return {
    search,
    tokenIdValue,
    onSearchChange,
    onTokenIdChange,
    handleIncrement,
    handleDecrement,
    translation,
    switcherData
  };
};
