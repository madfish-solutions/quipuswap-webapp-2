import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { withTypes, Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import { validateMinMax } from '@utils/validators';
import { parseDecimals } from '@utils/helpers';
import { Tooltip } from '@components/ui/Tooltip';
import { TEZOS_TOKEN } from '@utils/defaults';
import { Card } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { ComplexInput } from '@components/ui/ComplexInput';
import { CardCell } from '@components/ui/Card/CardCell';
import { Switcher } from '@components/ui/Switcher';
import { StickyBlock } from '@components/common/StickyBlock';
import { Slippage } from '@components/common/Slippage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
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
  token1: string
  token2: string
};

type LiquidityProps = {
  className?: string
};

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [switcherValue, setSwitcherValue] = useState(true); // TODO: Delete when lib added

  const [lastChange, setLastChange] = useState('token1');

  const { Form } = withTypes<FormValues>();

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  return (
    <StickyBlock className={className}>
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
        <Form
          onSubmit={() => {}}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value);
            },
          }}
          render={({ form, values }) => (
            <>
              {currentTab.id === 'remove' && (
              <Field
                name="tokenPair"
              >
                {({ input }) => (
                  <>
                    <ComplexInput
                      {...input}
                      token1={TEZOS_TOKEN}
                      handleBalance={(value) => {
                        form.mutators.setValue(
                          'tokenPair',
                          +value,
                        );
                      }}
                      id="liquidity-remove-input"
                      label="Select LP"
                      className={s.input}
                      mode="votes"
                    />
                    <ArrowDown className={s.iconButton} />
                  </>
                )}
              </Field>
              )}

              <Field
                name="token1"
                validate={validateMinMax(0, Infinity)}
                parse={(value) => parseDecimals(value, 0, Infinity)}
              >
                {({ input }) => (
                  <>
                    <ComplexInput
                      {...input}
                      token1={TEZOS_TOKEN}
                      handleBalance={(value) => {
                        form.mutators.setValue(
                          'token1',
                          +value,
                        );
                        if (!switcherValue) {
                          form.mutators.setValue(
                            'token2',
                            +value,
                          );
                        }
                      }}
                      id="liquidity-token-1"
                      label="Input"
                      className={s.input}
                      readOnly={currentTab.id === 'remove'}
                    />
                    <OnChange name="token1">
                      {(value:string) => {
                        setLastChange('token1');
                        if (!switcherValue) {
                          form.mutators.setValue(
                            'token2',
                            +value,
                          );
                        }
                      }}
                    </OnChange>
                  </>
                )}

              </Field>
              <Plus className={s.iconButton} />
              <Field
                name="token2"
                validate={validateMinMax(0, Infinity)}
                parse={(value) => parseDecimals(value, 0, Infinity)}
              >
                {({ input }) => (
                  <>
                    <ComplexInput
                      {...input}
                      token1={TEZOS_TOKEN}
                      handleBalance={(value) => {
                        form.mutators.setValue(
                          'token2',
                          +value,
                        );
                        if (!switcherValue) {
                          form.mutators.setValue(
                            'token1',
                            +value,
                          );
                        }
                      }}
                      id="liquidity-token-2"
                      label="Output"
                      className={cx(s.input, s.mb24)}
                      readOnly={currentTab.id === 'remove'}
                    />
                    <OnChange name="token2">
                      {(value:string) => {
                        setLastChange('token2');
                        if (!switcherValue) {
                          form.mutators.setValue(
                            'token1',
                            value,
                          );
                        }
                      }}
                    </OnChange>
                  </>
                )}
              </Field>

              {/* SWAP */}

              <Slippage />

              {currentTab.id === 'add' && (
              <>
                {!switcherValue ? (
                  <Field name="token2">
                    {({ input }) => (
                      <div className={cx(s.receive, s.mb24)}>
                        <span className={s.receiveLabel}>
                          Max invested XTZ/QPLP:
                        </span>
                        <CurrencyAmount amount={input.value} />
                      </div>

                    )}

                  </Field>
                )
                  : (
                    <>
                      <Field name="token1">
                        {({ input }) => (
                          <div className={s.receive}>
                            <span className={s.receiveLabel}>
                              Max invested XTZ:
                            </span>
                            <CurrencyAmount amount={input.value} />
                          </div>
                        )}
                      </Field>
                      <Field name="token2">
                        {({ input }) => (
                          <div className={cx(s.receive, s.mb24)}>
                            <span className={s.receiveLabel}>
                              Max invested QPTP:
                            </span>
                            <CurrencyAmount amount={input.value} />
                          </div>
                        )}
                      </Field>
                    </>
                  )}
                <div className={s.switcher}>
                  <Switcher
                    isActive={switcherValue}
                    onChange={() => {
                      if (switcherValue) {
                        form.mutators.setValue(
                          lastChange === 'token1' ? 'token2' : 'token1',
                          values[lastChange !== 'token1' ? 'token2' : 'token1'],
                        );
                      }
                      setSwitcherValue(!switcherValue);
                    }}
                    className={s.switcherInput}
                  />
                  Rebalance Liquidity
                  <Tooltip content="Token prices in a pool may change significantly within seconds. Slippage tolerance defines the difference between the expected and current exchange rate that you find acceptable. The higher the slippage tolerance, the more likely a transaction will go through." />
                </div>
              </>
              )}
              {currentTab.id === 'remove' && (
              <>
                <div className={s.receive}>
                  <span className={s.receiveLabel}>
                    Minimum received XTZ:
                  </span>
                  <CurrencyAmount amount="1233" currency="XTZ" />
                </div>
                <div className={s.receive}>
                  <span className={s.receiveLabel}>
                    Minimum received QPTP:
                  </span>
                  <CurrencyAmount amount="1233" currency="QPTP" />
                </div>
              </>
              )}
              <Button className={s.button}>
                {currentTab.id === 'add' ? 'Add' : 'Remove & Unvote'}
              </Button>
            </>
          )}
        />
      </Card>
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
