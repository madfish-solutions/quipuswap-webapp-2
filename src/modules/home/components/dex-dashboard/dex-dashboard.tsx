import { useEffect, FC, useState } from 'react';

import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { HIDE_ANALYTICS, IS_NETWORK_MAINNET } from '@config/config';
import { RPC_URLS } from '@config/enviroment';
import { MAINNET_DEFAULT_TOKEN } from '@config/tokens';
import { Card } from '@shared/components/card';
import { Slider } from '@shared/components/slider';
import { getStorageInfo } from '@shared/dapp';
import { fromDecimals } from '@shared/helpers';
import { QSNets } from '@shared/types';
import { useTranslation } from '@translation';

import { Section } from '../section';
import { DexDashboardInner } from './dex-dashboard-inner';
import s from './dex-dashboard.module.scss';

const ZERO = 0;

export const DexDashboard: FC = () => {
  const { t } = useTranslation(['home']);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    const asyncLoad = async () => {
      // TODO: change after deploy token to testnet
      const tezos = new TezosToolkit(RPC_URLS[QSNets.mainnet]);
      const contract = await getStorageInfo(tezos, MAINNET_DEFAULT_TOKEN.contractAddress);
      // @ts-ignore
      const rawTotalSupply = await contract?.token_info.get(ZERO);
      setTotalSupply(fromDecimals(rawTotalSupply, MAINNET_DEFAULT_TOKEN));
    };
    void asyncLoad();
  }, []);

  const desktopContentClassName = IS_NETWORK_MAINNET && !HIDE_ANALYTICS ? s.content : cx(s.content, s.testnet);

  return (
    <Section
      header={t('home|DEX Dashboard')}
      description={t('home|The short overview of the most relevant DEX information.')}
    >
      <Card className={s.mobile} contentClassName={s.mobContent}>
        <Slider className={s.mobSlider}>
          <DexDashboardInner
            volume24={null}
            totalLiquidity={null}
            xtzUsdQuote={null}
            transactionsCount24h={null}
            totalSupply={totalSupply}
            loading={false}
          />
        </Slider>
      </Card>
      <Card className={s.desktop} contentClassName={desktopContentClassName}>
        <DexDashboardInner
          volume24={'888888'}
          totalLiquidity={'888888'}
          xtzUsdQuote={'888888'}
          transactionsCount24h={888888}
          totalSupply={totalSupply}
          loading={false}
        />
      </Card>
    </Section>
  );
};
