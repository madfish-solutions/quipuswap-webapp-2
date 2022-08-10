import { useEffect, FC, useState } from 'react';

import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { HIDE_ANALYTICS, IS_NETWORK_MAINNET } from '@config/config';
import { RPC_URL } from '@config/environment';
import { MAINNET_QUIPU_TOKEN } from '@config/tokens';
import { Card } from '@shared/components/card';
import { Slider } from '@shared/components/slider';
import { getStorageInfo } from '@shared/dapp';
import { toReal } from '@shared/helpers';
import { useTranslation } from '@translation';

import { Section } from '../section';
import { DexDashboardInner } from './dex-dashboard-inner';
import s from './dex-dashboard.module.scss';

const ZERO = 0;

export const DexDashboard: FC = () => {
  const { t } = useTranslation(['home']);
  const [realTotalSupply, setRealTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    const asyncLoad = async () => {
      // TODO: change after deploy token to testnet
      const tezos = new TezosToolkit(RPC_URL);
      const contract = await getStorageInfo(tezos, MAINNET_QUIPU_TOKEN.contractAddress);
      // @ts-ignore
      const rawTotalSupply = await contract?.token_info.get(ZERO);
      setRealTotalSupply(toReal(rawTotalSupply, MAINNET_QUIPU_TOKEN));
    };
    void asyncLoad();
  }, []);

  const desktopContentClassName = IS_NETWORK_MAINNET && !HIDE_ANALYTICS ? s.content : cx(s.content, s.testnet);

  const content = (
    <DexDashboardInner
      volume24={null}
      totalLiquidity={null}
      xtzUsdQuote={null}
      transactionsCount24h={null}
      totalSupply={realTotalSupply}
      loading={false}
    />
  );

  return (
    <Section
      header={t('home|DEX Dashboard')}
      description={t('home|The short overview of the most relevant DEX information.')}
      data-test-id="dexDashboardSection"
    >
      <Card className={s.mobile} contentClassName={s.mobContent} data-test-id="DEXDashboardMobile">
        <Slider className={s.mobSlider}>{content}</Slider>
      </Card>
      <Card className={s.desktop} contentClassName={desktopContentClassName} data-test-id="DEXDashboardDesktop">
        {content}
      </Card>
    </Section>
  );
};
