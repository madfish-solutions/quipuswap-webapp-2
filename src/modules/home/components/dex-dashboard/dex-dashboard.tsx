import { useEffect, FC } from 'react';

import { Card, SliderUI } from '@quipuswap/ui-kit';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { IS_NETWORK_MAINNET, MAINNET_DEFAULT_TOKEN, MAINNET_RPC_URL } from '@config';
import { getStorageInfo } from '@shared/dapp';
import { fromDecimals } from '@shared/helpers';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Section } from '../section';
import s from './dex-dashboard.module.sass';

interface DexDashboardProps {
  className?: string;
}

const DEFAULT = 0;

export const DexDashboard: FC<DexDashboardProps> = ({ className }) => {
  const { t } = useTranslation(['home']);

  useEffect(() => {
    const asyncLoad = async () => {
      // TODO: change after deploy token to testnet
      const tezos = new TezosToolkit(MAINNET_RPC_URL);
      const contract = await getStorageInfo(tezos, MAINNET_DEFAULT_TOKEN.contractAddress);
      // @ts-ignore
      const rawTotalSupply = await contract?.token_info.get(DEFAULT);
      setTotalSupply(fromDecimals(rawTotalSupply, MAINNET_DEFAULT_TOKEN));
    };
    void asyncLoad();
  }, []);

  const desktopContentClassName = IS_NETWORK_MAINNET ? s.content : cx(s.content, s.testnet);

  return (
    <Section
      header={t('home|DEX Dashboard')}
      description={t('home|The short overview of the most relevant DEX information.')}
      className={cx(className)}
    >
      <Card className={s.mobile} contentClassName={s.mobContent}>
        <SliderUI className={s.mobSlider}></SliderUI>
      </Card>
      <Card className={s.desktop} contentClassName={desktopContentClassName}></Card>
    </Section>
  );
};
function setTotalSupply(arg0: BigNumber) {
  throw new Error('Function not implemented.');
}
