import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { withTypes, Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

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
                      handleBalance={(value) => {
                        form.mutators.setValue(
                          'token3',
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
              >
                {({ input }) => (
                  <>
                    <ComplexInput
                      {...input}
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
              >
                {({ input }) => (
                  <>
                    <ComplexInput
                      {...input}
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
                <div className={cx(s.receive, s.mb24)}>
                  <span className={s.receiveLabel}>
                    Minimum received:
                  </span>
                  <CurrencyAmount amount="1233" currency="XTZ/QPLP" />
                </div>
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
        <CardCell header={t('common:Sell Price')} className={s.cell}>
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="tez" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="100000.11" currency="QPSP" dollarEquivalent="400" />
          </div>
        </CardCell>
        <CardCell header={t('common:Buy Price')} className={s.cell}>
          <div className={s.cellAmount}>
            <CurrencyAmount amount="1" currency="QPSP" />
            <span className={s.equal}>=</span>
            <CurrencyAmount amount="1000000000.000011" currency="tez" dollarEquivalent="0.00004" />
          </div>
        </CardCell>
        <CardCell header={t('liquidity:Token A Locked')} className={s.cell}>
          <CurrencyAmount amount="10000" currency="tez" />
        </CardCell>
        <CardCell header={t('liquidity:Token B Locked')} className={s.cell}>
          <CurrencyAmount amount="10000" currency="QPSP" />
        </CardCell>
        <CardCell header={t('liquidity:Your Total LP')} className={s.cell}>
          <CurrencyAmount amount="1000000" />
        </CardCell>
        <CardCell header={t('liquidity:Your Frozen LP')} className={s.cell}>
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
