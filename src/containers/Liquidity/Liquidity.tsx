import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { withTypes, Field } from 'react-final-form';

import { WhitelistedTokenPair } from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';
import { parseDecimals } from '@utils/helpers';
import { validateMinMax } from '@utils/validators';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { Switcher } from '@components/ui/Switcher';
import { TokenSelect } from '@components/ui/ComplexInput/TokenSelect';
import { PositionSelect } from '@components/ui/ComplexInput/PositionSelect';
import { ComplexInput } from '@components/ui/ComplexInput';
import { Tooltip } from '@components/ui/Tooltip';
import { StickyBlock } from '@components/common/StickyBlock';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { PositionsModal } from '@components/modals/PositionsModal';
import { Transactions } from '@components/svg/Transactions';
import { ArrowDown } from '@components/svg/ArrowDown';
import { Plus } from '@components/svg/Plus';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

const TabsContent = [
  {
    id: 'add',
    label: 'Add',
  },
  {
    id: 'remove',
    label: 'Remove',
  },
];

type FormValues = {
  switcher: boolean
  balance1: number
  balance2: number
  balance3: number
  lpBalance: string
  frozenBalance: string
  lastChange: string
  estimateLP: string
  slippage: string
};

type LiquidityProps = {
  className?: string
};

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const [tokensModal, setTokensModal] = useState<number>(0);
  const [tokenPair, setTokenPair] = useState<WhitelistedTokenPair>();
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [, setLastChange] = useState<'balance1' | 'balance2'>('balance1');

  const { Form } = withTypes<FormValues>();

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  return (
    <StickyBlock className={className}>
      <PositionsModal
        isOpen={tokensModal !== 0}
        onRequestClose={() => setTokensModal(0)}
        onChange={(tp) => {
          if (tokensModal === 1) setTokenPair(tp);
          setTokensModal(0);
        }}
      />
      <Form
        onSubmit={() => {}}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({ form, values }) => (
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
            {currentTab.id === 'remove' && (
              <Field
                name="balance3"
              >
                {({ input }) => (
                  <>
                    <PositionSelect
                      {...input}
                      tokenPair={tokenPair}
                      setTokenPair={(pair) => {
                        setTokenPair(pair);
                      }}
                      handleBalance={(value) => {
                        form.mutators.setValue(
                          'balance3',
                          +value,
                        );
                      }}
                      balance={(values.balance3 ?? 0).toString()}
                      id="liquidity-remove-input"
                      label="Select LP"
                      className={s.input}
                    />
                    <ArrowDown className={s.iconButton} />
                  </>
                )}
              </Field>
            )}
            <Field
              name="balance1"
              validate={validateMinMax(0, Infinity)}
              parse={(value) => parseDecimals(value, 0, Infinity)}
            >
              {({ input }) => (
                <>
                  {currentTab.id !== 'remove' && (
                    <>
                      <TokenSelect
                        {...input}
                        onFocus={() => setLastChange('balance1')}
                        token={(tokenPair?.token1) ?? TEZOS_TOKEN}
                        setToken={() => {}}
                        handleBalance={(value) => {
                          setLastChange('balance1');
                          form.mutators.setValue(
                            'balance1',
                            +value,
                          );
                        }}
                        balance="10"
                        id="liquidity-token-1"
                        label="Input"
                        className={s.input}
                      />
                    </>
                  )}
                  {currentTab.id === 'remove' && (
                    <ComplexInput
                      {...input}
                      token1={(tokenPair?.token1) ?? TEZOS_TOKEN}
                      id="liquidity-token-1"
                      label="Output"
                      className={cx(s.input, s.mb24)}
                      readOnly
                    />
                  )}
                </>
              )}

            </Field>
            <Plus className={s.iconButton} />
            <Field
              name="balance2"
              validate={validateMinMax(0, Infinity)}
              parse={(value) => parseDecimals(value, 0, Infinity)}
            >
              {({ input }) => (
                <>
                  {currentTab.id !== 'remove' && (
                    <>
                      <TokenSelect
                        {...input}
                        onFocus={() => setLastChange('balance2')}
                        token={(tokenPair?.token2) ?? TEZOS_TOKEN}
                        setToken={() => {}}
                        handleBalance={(value) => {
                          setLastChange('balance2');
                          form.mutators.setValue(
                            'balance2',
                            +value,
                          );
                        }}
                        balance="10"
                        id="liquidity-token-2"
                        label="Input"
                        className={cx(s.input, s.mb24)}
                      />
                    </>
                  )}
                  {currentTab.id === 'remove' && (
                    <ComplexInput
                      {...input}
                      token1={(tokenPair?.token2) ?? TEZOS_TOKEN}
                      id="liquidity-token-2"
                      label="Output"
                      className={cx(s.input, s.mb24)}
                      readOnly
                    />
                  )}
                </>
              )}
            </Field>

            <Field initialValue="0.5 %" name="slippage">
              {() => (
                <>
                  <Slippage handleChange={() => {}} />
                  {currentTab.id === 'add' && (
                  <>
                    {!values.switcher ? (
                      <div className={cx(s.receive, s.mb24)}>
                        <span className={s.receiveLabel}>
                          Max invested:
                        </span>
                        <CurrencyAmount
                          currency="XTZ / XTZ"
                          amount="5"
                        />
                      </div>
                    )
                      : (
                        <>
                          <div className={s.receive}>
                            <span className={s.receiveLabel}>
                              Max invested:
                            </span>
                            <CurrencyAmount
                              currency="XTZ"
                              amount="5"
                            />
                          </div>
                          <div className={cx(s.receive, s.mb24)}>
                            <span className={s.receiveLabel}>
                              Max invested:
                            </span>
                            <CurrencyAmount
                              currency="XTZ"
                              amount="5"
                            />
                          </div>
                        </>
                      )}
                  </>
                  )}

                  {currentTab.id === 'remove' && (
                    <>
                      <div className={s.receive}>
                        <span className={s.receiveLabel}>
                          Minimum received:
                        </span>
                        <CurrencyAmount
                          currency="XTZ"
                          amount="5"
                        />
                      </div>
                      <div className={s.receive}>
                        <span className={s.receiveLabel}>
                          Minimum received:
                        </span>
                        <CurrencyAmount
                          currency="XTZ"
                          amount="5"
                        />
                      </div>
                      <Button className={s.button}>
                        Remove & Unvote
                      </Button>
                    </>
                  )}
                </>
              )}
            </Field>

            {currentTab.id === 'add' && (
              <>
                <Field name="switcher">
                  {({ input }) => (

                    <div className={s.switcher}>
                      <Switcher
                        {...input}
                        isActive={input.value}
                        className={s.switcherInput}
                      />
                      Rebalance Liquidity
                      <Tooltip content="Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through." />
                    </div>
                  )}
                </Field>
                <Button className={s.button}>
                  {currentTab.label}
                </Button>
              </>
            )}
          </Card>
        )}
      />
      <Card
        header={{
          content: `${currentTab.label} Liquidity Details`,
        }}
        contentClassName={s.content}
      >
        <CardCell
          header={(
            <>
              {t('common:Sell Price')}
              <Tooltip
                sizeT="small"
                content={t('common:The amount of token B you receive for 1 token A, according to the current exchange rate.')}
              />
            </>
        )}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="tez" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="100000.11" currency="QPSP" dollarEquivalent="400" />
          </div>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('common:Buy Price')}
              <Tooltip
                sizeT="small"
                content={t('common:The amount of token A you receive for 1 token B, according to the current exchange rate.')}
              />
            </>
        )}
          className={s.cell}
        >
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="QPSP" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="1000000000.000011" currency="tez" dollarEquivalent="0.00004" />
          </div>
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Token A Locked')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:The amount of token A that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="10000" currency="tez" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Token B Locked')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:The amount of token B that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="10000" currency="QPSP" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Your Total LP')}
              <Tooltip
                sizeT="small"
                content={t("liquidity:Total amount of this pool's LP tokens you will own after adding liquidity. LP (Liquidity Pool) tokens represent your current share in a pool.")}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="1000000" />
        </CardCell>
        <CardCell
          header={(
            <>
              {t('liquidity:Your Frozen LP')}
              <Tooltip
                sizeT="small"
                content={t('liquidity:Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.')}
              />
            </>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="100" />
        </CardCell>
        <div className={s.detailsButtons}>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Pair Analytics
            <ExternalLink className={s.linkIcon} />
          </Button>
          <Button
            className={s.detailsButton}
            theme="inverse"
          >
            View Pair Contract
            <ExternalLink className={s.linkIcon} />
          </Button>
        </div>
      </Card>
    </StickyBlock>

  );
};
