import { useCallback, useMemo, useState } from 'react';

import { useTokens } from '@providers/dapp-tokens';
import { getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { useTokensModalTabsService } from './tokens-modal-tabs.service';
import { TokensModalViewProps } from './types';
import { useTokensModalStore } from './use-tokens-modal-store';

export const useTokensModalViewModel = (): TokensModalViewProps => {
  const tabsProps = useTokensModalTabsService();

  const tokensModalStore = useTokensModalStore();

  const { data: tokensList } = useTokens();

  const [choosenTokens, setChoosenTokens] = useState<Array<Token>>([]);

  const choosenTokensSlugs = useMemo(() => choosenTokens.map(getTokenSlug), [choosenTokens]);

  const onTokenClick = useCallback(
    (token: Token) => {
      if (choosenTokensSlugs.includes(getTokenSlug(token))) {
        const newChoosenToken = choosenTokens.filter(
          choosenToken => getTokenSlug(choosenToken) !== getTokenSlug(token)
        );

        setChoosenTokens(_ => newChoosenToken);
      } else {
        setChoosenTokens(prev => [...prev, token]);
      }
    },
    [choosenTokens, choosenTokensSlugs]
  );

  const tokens = useMemo(() => {
    return tokensList.map(token => {
      if (choosenTokensSlugs.includes(getTokenSlug(token))) {
        return {
          token: {
            ...token,
            isChoosen: true
          },
          onTokenClick: () => onTokenClick(token)
        };
      }

      return { token: { ...token, isChoosen: false }, onTokenClick: () => onTokenClick(token) };
    });
  }, [choosenTokensSlugs, onTokenClick, tokensList]);

  const openTokensModal = () => {
    tokensModalStore.setOpenState(true);
  };

  const closeTokensModal = () => {
    tokensModalStore.setOpenState(false);
  };

  const setTokens = () => {
    tokensModalStore.setChoosenTokens(choosenTokens);

    closeTokensModal();
  };

  return { setTokens, tokens, isModalOpen: tokensModalStore.isOpen, openTokensModal, closeTokensModal, tabsProps };
};
