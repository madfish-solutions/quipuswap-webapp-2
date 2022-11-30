import { useCallback, useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { useLiquidityItemStore } from '@modules/liquidity/hooks';
import { i18n } from '@translation';

import { LiquidityRoutes, LiquidityTabs } from '../../liquidity-routes.enum';

export const useLiquidityFormTabsCardViewModel = () => {
  const navigate = useNavigate();
  const { pairSlug } = useParams();
  const itemStore = useLiquidityItemStore();

  const _TabsContent = useMemo(() => {
    const isTez = pairSlug?.split('-').some(item => item === 'tez');

    return [
      {
        id: LiquidityTabs.add,
        label: i18n.t('common|Add')
      },
      {
        id: LiquidityTabs.remove,
        label: i18n.t('common|Remove')
      }
    ].concat(
      isTez
        ? [
            {
              id: LiquidityTabs.claim,
              label: i18n.t('common|Claim')
            }
          ]
        : []
    );
  }, [pairSlug]);

  const changeTabHandle = useCallback(
    (tab: LiquidityTabs) => {
      const url = `${AppRootRoutes.Liquidity}${LiquidityRoutes.cpmm}/${tab}/${pairSlug}`;

      navigate(url);
    },
    [navigate, pairSlug]
  );

  return {
    isLoading: itemStore.itemIsLoading,
    changeTabHandle,
    TabsContent: _TabsContent
  };
};
