import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { useTokens } from '@utils/dapp';
import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { TopAssets } from '@components/home/TopAssets';

type TopFarmingsProps = {
  className?: string
};

export const TopFarmings: React.FC<TopFarmingsProps> = ({
  className,
}) => {
  const { t } = useTranslation(['home']);
  const { data: tokens } = useTokens();
  const farms = useMemo(() => tokens.map((x) => (x.contractAddress === TEZOS_TOKEN.contractAddress
    ? { tokenPair: { token1: x, token2: STABLE_TOKEN } }
    : { tokenPair: { token1: x, token2: TEZOS_TOKEN } })), [tokens]);
  return (
    <TopAssets
      header={t('home:Top Farms')}
      description={t('home:The most popular Farming pools by APR')}
      data={farms}
      button={{
        href: '/farmings',
        label: t('home:View All Farms'),
      }}
      className={className}
      isFarm
    />
  );
};
