import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TEZOS_TOKEN } from '@utils/defaults';
import { Card, CardContent, CardHeader } from '@components/ui/Card';
import { Tabs } from '@components/ui/Tabs';
import { Button } from '@components/ui/Button';
import { ComplexBaker, ComplexInput } from '@components/ui/ComplexInput';
import { Tooltip } from '@components/ui/Tooltip';
import { CardCell } from '@components/ui/Card/CardCell';
import { StickyBlock } from '@components/common/StickyBlock';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Transactions } from '@components/svg/Transactions';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

const TabsContent = [
  {
    id: 'vote',
    label: 'Vote',
  },
  {
    id: 'veto',
    label: 'Veto',
  },
];

type VotingProps = {
  className?: string
};

export const Voting: React.FC<VotingProps> = ({
  className,
}) => {
  const { t } = useTranslation(['vote']);
  const [tabsState, setTabsState] = useState(TabsContent[0].id); // TODO: Change to routes
  const [inputValue, setInputValue] = useState<string>(''); // TODO: Delete when lib added
  const handleInputChange = (state: any) => {
    setInputValue(state.target.value);
  }; // TODO: Delete when lib added

  const currentTab = useMemo(
    () => (TabsContent.find(({ id }) => id === tabsState)!),
    [tabsState],
  );

  return (
    <StickyBlock className={className}>
      <Card>
        <CardHeader
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
          }}
          className={s.header}
        />
        <CardContent className={s.content}>

          <ComplexInput
            token1={TEZOS_TOKEN}
            value={inputValue}
            onChange={handleInputChange}
            handleBalance={(value) => setInputValue(value)}
            id="voting-input"
            label="Votes"
            className={cx(s.input, s.mb24)}
            mode="votes"
          />
          {currentTab.id === 'vote' && (
          <ComplexBaker
            label="Baker"
            id="voting-baker"
          />
          )}
          <div className={s.buttons}>
            <Button className={s.button} theme="secondary">
              {currentTab.id === 'vote' ? 'Unvote' : 'Remove veto'}
            </Button>
            <Button className={s.button}>
              {currentTab.label}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader header={{
          content: 'Voting Details',
        }}
        />
        <CardContent className={s.content}>

          <CardCell
            header={(
              <>
                {t('vote:Delegated To')}
                <Tooltip
                  sizeT="small"
                  content={t('vote:Current baker elected by simple majority of votes.')}
                />
              </>
          )}
            className={s.cell}
          >
            <Button theme="underlined">
              Everstake
            </Button>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('vote:Second Candidate')}
                <Tooltip
                  sizeT="small"
                  content={t('vote:The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.')}
                />
              </>
          )}
            className={s.cell}
          >
            <Button theme="underlined">
              Bake’n’Roll
            </Button>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('veto:Total Votes')}
                <Tooltip
                  sizeT="small"
                  content={t('vote:The total amount of votes cast to elect a baker in the pool.')}
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
                {t('veto:Total Vetos')}
                <Tooltip
                  sizeT="small"
                  content={t('vote:The total amount of shares cast so far to veto the current baker.')}
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
                {t('veto:Your Candidate')}
                <Tooltip
                  sizeT="small"
                  content={t('vote:The candidate you voted for.')}
                />
              </>
          )}
            className={s.cell}
          >
            <Button theme="underlined">
              Bake’n’Roll
            </Button>
          </CardCell>
          <CardCell
            header={(
              <>
                {t('Votes To Veto Left')}
                <Tooltip
                  sizeT="small"
                  content={t('vote:This much more votes needed to veto a delegate.')}
                />
              </>
          )}
            className={s.cell}
          >
            <CurrencyAmount amount="1000000" />
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
              View Delegation Analytics
              <ExternalLink className={s.linkIcon} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </StickyBlock>
  );
};
