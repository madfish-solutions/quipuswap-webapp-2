import { FC, Fragment, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { QUIPU_TOKEN, TEZOS_TOKEN_SLUG } from '@config/tokens';
import { PageTitle, StickyBlock, TestnetAlert } from '@shared/components';
import { getFullLiquidityUrl, getSymbolsString, getTokenSlug } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';
import { useTranslation } from '@translation';

import { LiquidityCards } from './liquidity-cards';
import { parseUrl } from './liquidity-cards/helpers';

const DEFAULT_TAB = 'add';
const DEFAULT_LIQUIDITY_TOKEN_A = TEZOS_TOKEN_SLUG;
const DEFAULT_LIQUIDITY_TOKEN_B = getTokenSlug(QUIPU_TOKEN);

interface LiquidityProps {
  className?: string;
}

export const LiquidityPage: FC<LiquidityProps> = ({ className }) => {
  const { t } = useTranslation(['common']);

  const [title, setTitle] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;
  const { tabId, tokenAFromUrl, tokenBFromUrl } = parseUrl(url);

  useEffect(() => {
    if (!tabId || !tokenAFromUrl || !tokenBFromUrl) {
      const _url = getFullLiquidityUrl(
        tabId || DEFAULT_TAB,
        tokenAFromUrl || DEFAULT_LIQUIDITY_TOKEN_A,
        tokenBFromUrl || DEFAULT_LIQUIDITY_TOKEN_B
      );
      navigate(_url, { replace: true });
    }
  }, [navigate, tabId, tokenAFromUrl, tokenBFromUrl]);

  const getTitle = (token1: Nullable<Token>, token2: Nullable<Token>) => getSymbolsString([token1, token2]);

  const handleTokensChange = (token1: Nullable<Token>, token2: Nullable<Token>) => {
    setTitle(getTitle(token1, token2));
  };

  if (!tabId || !tokenAFromUrl || !tokenBFromUrl) {
    return null;
  }

  return (
    <Fragment>
      <TestnetAlert />
      <PageTitle data-test-id="liquidityPageTitle">
        {t('common|Liquidity')} {title}
      </PageTitle>
      <StickyBlock className={className}>
        <LiquidityCards onTokensChange={handleTokensChange} />
      </StickyBlock>
    </Fragment>
  );
};
