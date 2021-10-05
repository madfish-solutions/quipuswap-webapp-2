import React, {
  useContext,
} from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { withTypes } from 'react-final-form';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { STABLE_TOKEN } from '@utils/defaults';
import { FarmingFormValues, WhitelistedFarm, WhitelistedFarmOptional } from '@utils/types';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { LineChartSampleData } from '@components/charts/content';
import { FarmingForm } from '@components/farming/FarmingForm';
import { Timeleft } from '@components/ui/Timeleft';
import { Back } from '@components/svg/Back';
import { VotingReward } from '@components/svg/VotingReward';

import s from './FarmingInfo.module.sass';

const LineChart = dynamic(() => import('@components/charts/LineChart'), {
  ssr: false,
});

type FarmingInfoProps = {
  farm:WhitelistedFarmOptional
  className?: string
  handleUnselect: () => void
  onClick?:(farm:WhitelistedFarm) => void
  amount?: string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const FarmingInfo: React.FC<FarmingInfoProps> = ({
  className,
  farm,
  amount = '1000000',
}) => {
  const {
    remaining,
    tokenPair,
  } = farm;
  const { t } = useTranslation(['common', 'farms']);
  const { Form } = withTypes<FarmingFormValues>();
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compountClassName = cx(
    modeClass[colorThemeMode],
    s.mb24i,
    className,
  );
  return (
    <>
      <Card
        className={compountClassName}
        contentClassName={s.topContent}
        header={{
          content: (
            <Button
              href="/farm"
              theme="quaternary"
              className={s.proposalHeader}
              control={
                <Back className={s.proposalBackIcon} />
            }
            >
              {t('farms|Back to Vaults')}
            </Button>
          ),
        }}
      >
        <div className={cx(s.fullWidth, s.flex)}>
          <div className={s.reward}>
            <div className={s.rewardContent}>
              <span className={s.rewardHeader}>
                {t('farms|Your Pending Reward')}
              </span>
              <span className={s.rewardAmount}>
                100,000,000
                <span className={s.rewardCurrency}>{getWhitelistedTokenSymbol(STABLE_TOKEN)}</span>
              </span>
            </div>
            <VotingReward />
          </div>
          <div className={s.notRewards}>
            <div className={s.itemsRows}>
              <div className={s.item}>
                <header className={s.header}>
                  Your Share
                </header>
                <span className={s.amount}>1,000,000.00(0.001$)</span>
              </div>
              <div className={s.item}>
                <span className={s.header}>
                  Your Delegate
                </span>
                <Button theme="inverse" className={s.amount}>Everstake</Button>
              </div>
              <div className={s.item}>
                <Timeleft remaining={remaining} />
              </div>

            </div>
            <Button className={cx(s.statButton, s.button)}>Harvest</Button>
          </div>
        </div>
      </Card>
      <LineChart
        className={s.chart}
        data={LineChartSampleData}
        headerContent={(
          <div className={s.tokens}>
            <TokensLogos
              token1={tokenPair.token1}
              token2={tokenPair.token2}
              width={32}
              className={s.tokenLogos}
            />
            <h3 className={s.title}>
              {getWhitelistedTokenSymbol(tokenPair.token1)}
              {' '}
              /
              {' '}
              {getWhitelistedTokenSymbol(tokenPair.token1)}
            </h3>
          </div>
        )}
      />
      <Form
        onSubmit={() => {
          // if (!tezos) return;
          // handleLoader();
          // submitForm(
          //   tezos,
          //   currentTab.id === 'remove'
          //     ? removeLiquidityParams
          //     : addLiquidityParams,
          //   handleErrorToast,
          //   handleSuccessToast,
          //   currentTab.id,
          // );
        }}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ handleSubmit, form }) => (
          // <LiquidityForm
          //   form={form}
          //   handleSubmit={handleSubmit}
          //   debounce={100}
          //   save={() => {}}
          //   setTabsState={setTabsState}
          //   tabsState={tabsState}
          //   token1={token1}
          //   token2={token2}
          //   setTokens={setTokens}
          //   tokenPair={tokenPair}
          //   setTokenPair={setTokenPair}
          //   tokensData={tokensData}
          //   handleTokenChange={handleTokenChangeWrapper}
          //   currentTab={currentTab}
          //   setRemoveLiquidityParams={setRemoveLiquidityParams}
          //   removeLiquidityParams={removeLiquidityParams}
          //   setAddLiquidityParams={setAddLiquidityParams}
          //   addLiquidityParams={addLiquidityParams}
          // />

          <FarmingForm
            form={form}
            handleSubmit={handleSubmit}
            debounce={100}
            save={() => {}}
            remaining={remaining}
            amount={amount}
            token1={tokenPair.token1}
            token2={tokenPair.token2}
          />
        )}
      />
    </>
  );
};
