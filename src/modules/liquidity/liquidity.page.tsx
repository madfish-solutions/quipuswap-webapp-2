import { FC, Fragment, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { DEFAULT_TOKEN, TEZOS_TOKEN_SYMBOL } from '@config/tokens';
import { PageTitle, StickyBlock } from '@shared/components';
import { getTokenSlug, getTokensOptionalPairName } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';
import { useTranslation } from '@translation';

import { LiquidityCards } from './liquidity-cards';
import { getFullLiquidityUrl, parseUrl } from './liquidity-cards/helpers';

const DEFAULT_TAB = 'add';
const DEFAULT_LIQUIDITY_TOKEN_A = TEZOS_TOKEN_SYMBOL;
const DEFAULT_LIQUIDITY_TOKEN_B = getTokenSlug(DEFAULT_TOKEN);

interface LiquidityProps {
  className?: string;
}

export const Liquidity: FC<LiquidityProps> = ({ className }) => {
  const { t } = useTranslation(['common']);

  const [title, setTitle] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname;
  const { tabId, tokenAFromUrl, tokenBFromUrl } = parseUrl(url);

  useEffect(() => {
    if (!tabId || !tokenAFromUrl || !tokenBFromUrl) {
      const url = getFullLiquidityUrl(
        tabId || DEFAULT_TAB,
        tokenAFromUrl || DEFAULT_LIQUIDITY_TOKEN_A,
        tokenBFromUrl || DEFAULT_LIQUIDITY_TOKEN_B
      );
      navigate(url, { replace: true });
    }
  }, [navigate, tabId, tokenAFromUrl, tokenBFromUrl]);

  const getTitle = (token1: Nullable<Token>, token2: Nullable<Token>) => getTokensOptionalPairName(token1, token2);

  const handleTokensChange = (token1: Nullable<Token>, token2: Nullable<Token>) => {
    setTitle(getTitle(token1, token2));
  };

  if (!tabId || !tokenAFromUrl || !tokenBFromUrl) {
    return null;
  }

  return (
    <Fragment>
      <PageTitle>
        {t('common|Liquidity')} {title}
      </PageTitle>
      <StickyBlock className={className}>
        <LiquidityCards onTokensChange={handleTokensChange} />
      </StickyBlock>
    </Fragment>
  );
};
