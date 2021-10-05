import React, {
  useMemo, useState,
} from 'react';
// import cx from 'classnames';
import { Field, FormSpy } from 'react-final-form';

import { TEZOS_TOKEN } from '@utils/defaults';
import { fromDecimals, getWhitelistedTokenAddress, parseDecimals } from '@utils/helpers';
import { WhitelistedTokenPair } from '@utils/types';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { ComplexBaker } from '@components/ui/ComplexInput';
import { StickyBlock } from '@components/common/StickyBlock';
import { FarmingDetails } from '@components/farming/FarmingDetails';
import { Transactions } from '@components/svg/Transactions';

import { composeValidators, validateBalance, validateMinMax } from '@utils/validators';
import BigNumber from 'bignumber.js';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { useAccountPkh } from '@utils/dapp';
import s from './FarmingForm.module.sass';

const TabsContent = [
  {
    id: 'stake',
    label: 'Stake',
  },
  {
    id: 'unstake',
    label: 'Unstake',
  },
];

type FarmingFormProps = {
  form:any,
  remaining: Date,
  amount: string,
  balance?: string,
  tokenPair: WhitelistedTokenPair
};

const RealForm:React.FC<FarmingFormProps> = ({
  remaining,
  amount,
  balance,
  tokenPair,
  form,
}) => {
  const accountPkh = useAccountPkh();
  const [tabsState, setTabsState] = useState(TabsContent[0].id);

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  return (

    <StickyBlock>
      <Card
        header={{
          content: (
            <Tabs
              values={TabsContent}
              activeId={tabsState}
              setActiveId={(val) => setTabsState(val)}
              className={s.tabs}
            />
          ),
          button: (
            <Button
              theme="quaternary"
            >
              <Transactions />
            </Button>
          ),
          className: s.header,
        }}
        contentClassName={s.content}
      >
        <Field
          name="balance3"
          validate={composeValidators(
            validateMinMax(0, Infinity),
            validateBalance(new BigNumber(fromDecimals(new BigNumber(balance ?? '0'), 6).toString())),
          )}
          parse={(v) => parseDecimals(v, 0, Infinity, 6)}
        >
          {({ input, meta }) => (
            <>
              <PositionSelect
                {...input}
                notSelectable1={TEZOS_TOKEN}
                tokenPair={tokenPair}
                setTokenPair={() => {
                  // setDex(undefined);
                  // setTokens([pair.token1, pair.token2]);
                  // handleTokenChange(pair.token1, 'first');
                  // handleTokenChange(pair.token2, 'second');
                  // hanldeTokenPairSelect(
                  //   pair,
                  //   setTokenPair,
                  //   handleTokenChange,
                  // );
                }}
                handleBalance={(value) => {
                  form.mutators.setValue(
                    'balance3',
                    +value,
                  );
                }}
                noBalanceButtons={!accountPkh}
                balance={fromDecimals(new BigNumber(balance ?? '0'), 6).toString()}
                id="liquidity-remove-input"
                label="Select LP"
                className={s.input}
                error={((meta.touched && meta.error) || meta.submitError)}
              />
            </>
          )}
        </Field>
        {currentTab.id === 'stake' && (
          <ComplexBaker
            className={s.baker}
            label="Baker"
            id="voting-baker"
          />
        )}
        <div className={s.tradeControls}>
          <Button
            theme="underlined"
            className={s.tradeBtn}
            href={`/swap/${getWhitelistedTokenAddress(tokenPair.token1)}-${getWhitelistedTokenAddress(tokenPair.token2)}`}
          >
            Trade
          </Button>
          {currentTab.id === 'stake' ? (
            <Button
              theme="underlined"
              className={s.tradeBtn}
              href={`/liquidity/add/${getWhitelistedTokenAddress(tokenPair.token1)}-${getWhitelistedTokenAddress(tokenPair.token2)}`}
            >
              Invest
            </Button>
          ) : (
            <Button
              theme="underlined"
              className={s.tradeBtn}
              href={`/liquidity/remove/${getWhitelistedTokenAddress(tokenPair.token1)}-${getWhitelistedTokenAddress(tokenPair.token2)}`}
            >
              Divest
            </Button>
          )}

        </div>
        <div className={s.buttons}>
          <Button className={s.button}>
            {currentTab.label}
          </Button>
        </div>
      </Card>

      {/* FARM */}
      <FarmingDetails
        remaining={remaining}
        amount={amount}
      />
    </StickyBlock>
  );
};

export const FarmingForm = (props:any) => (
  <FormSpy {...props} subscription={{ values: true }} component={RealForm} />
);
