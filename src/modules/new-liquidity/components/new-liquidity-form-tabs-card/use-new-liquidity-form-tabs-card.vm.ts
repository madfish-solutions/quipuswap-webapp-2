import { useCallback, useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { AppRootRoutes } from '@app.router';
import { NewLiquidityRoutes } from '@modules/new-liquidity/new-liquidity-routes.enum';
import { i18n } from '@translation';

import { NewLiquidityFormTabs } from '../../types';

export const TabsContent = [
  {
    id: NewLiquidityFormTabs.add,
    label: i18n.t('common|Add')
  },
  {
    id: NewLiquidityFormTabs.remove,
    label: i18n.t('common|Remove')
  }
];

export const useNewLiquidityFormTabsCardViewModel = () => {
  const navigate = useNavigate();
  const { pairSlug } = useParams();

  const _TabsContent = useMemo(() => {
    const isTez = pairSlug?.split('-').some(item => item === 'tez');

    return [
      {
        id: NewLiquidityFormTabs.add,
        label: i18n.t('common|Add')
      },
      {
        id: NewLiquidityFormTabs.remove,
        label: i18n.t('common|Remove')
      }
    ].concat(
      isTez
        ? [
            {
              id: NewLiquidityFormTabs.claim,
              label: i18n.t('common|Claim')
            }
          ]
        : []
    );
  }, [pairSlug]);

  const changeTabHandle = useCallback(
    (tab: NewLiquidityFormTabs) => {
      const url = `${AppRootRoutes.Liquidity}${NewLiquidityRoutes.cpmm}/${tab}/${pairSlug}`;

      navigate(url);
    },
    [navigate, pairSlug]
  );

  return {
    isLoading: false, // TODO store initialize, when itemStore will be ready
    changeTabHandle,
    TabsContent: _TabsContent
  };
};
