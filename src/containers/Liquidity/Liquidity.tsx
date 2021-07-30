import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { Tooltip } from '@components/ui/Tooltip';
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

type LiquidityProps = {
  className?: string
};

export const Liquidity: React.FC<LiquidityProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common', 'liquidity']);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [inputValue, setInputValue] = useState<string>(''); // TODO: Delete when lib added
  const [switcherValue, setSwitcherValue] = useState(true); // TODO: Delete when lib added
  const handleInputChange = (state: any) => {
    setInputValue(state.target.value);
  }; // TODO: Delete when lib added

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
        {currentTab.id === 'remove' && (
          <>
            <ComplexInput
              value={inputValue}
              onChange={handleInputChange}
              handleBalance={(value) => setInputValue(value)}
              id="liquidity-remove-input"
              label="Input"
              className={s.input}
              mode="votes"
            />
            <ArrowDown className={s.iconButton} />
          </>
        )}

        <ComplexInput
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          id="liquidity-token-1"
          label="Output"
          className={s.input}
          readOnly={currentTab.id === 'remove'}
        />
        <Plus className={s.iconButton} />
        <ComplexInput
          value={inputValue}
          onChange={handleInputChange}
          handleBalance={(value) => setInputValue(value)}
          id="liquidity-token-1"
          label="Output"
          className={cx(s.input, s.mb24)}
          readOnly={currentTab.id === 'remove'}
        />

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
                onChange={() => setSwitcherValue(!switcherValue)}
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
      </Card>
      <Card
        header={{
          content: `${currentTab.label} Liquidity Details`,
        }}
        contentClassName={s.content}
      >
        <CardCell
          header={(
            <Tooltip placement="top-start" content={t('common:The amount of token B you receive for 1 token A, according to the current exchange rate.')}>
              {t('common:Sell Price')}
            </Tooltip>
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
            <Tooltip placement="top-start" content={t('common:The amount of token A you receive for 1 token B, according to the current exchange rate.')}>
              {t('common:Buy Price')}
            </Tooltip>
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
            <Tooltip content={t('liquidity:The amount of token A that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}>
              {t('liquidity:Token A Locked')}
            </Tooltip>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="10000" currency="tez" />
        </CardCell>
        <CardCell
          header={(
            <Tooltip content={t('liquidity:The amount of token B that you lock in a liquidity pool. You add equal volumes of both tokens, according to the current exchange rate.')}>
              {t('liquidity:Token B Locked')}
            </Tooltip>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="10000" currency="QPSP" />
        </CardCell>
        <CardCell
          header={(
            <Tooltip content={t("liquidity:Total amount of this pool's LP tokens you will own after adding liquidity. LP (Liquidity Pool) tokens represent your current share in a pool.")}>
              {t('liquidity:Your Total LP')}
            </Tooltip>
          )}
          className={s.cell}
        >
          <CurrencyAmount amount="1000000" />
        </CardCell>
        <CardCell
          header={(
            <Tooltip content={t('liquidity:Frozen LPs are LPs you own that are locked in a smart contract (for voting, farming, etc.) and can not be moved or withdrawn until you unlock them.')}>
              {t('liquidity:Your Frozen LP')}
            </Tooltip>
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
