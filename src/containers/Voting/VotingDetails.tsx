import React, { useMemo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import {
  FoundDex,
} from '@quipuswap/sdk';
import { Card, Button } from '@madfish-solutions/quipu-ui-kit';

import { TEZOS_TOKEN } from '@utils/defaults';
import { useBakers } from '@utils/dapp';
import { fromDecimals, getWhitelistedBakerName } from '@utils/helpers';
import {
  VoterType, WhitelistedBaker, WhitelistedTokenPair,
} from '@utils/types';
import { Tooltip } from '@components/ui/Tooltip';
import { CardCell } from '@components/ui/Card/CardCell';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

type VotingDetailsProps = {
  tokenPair: WhitelistedTokenPair
  dex?: FoundDex
  voter?: VoterType
};

export const VotingDetails: React.FC<VotingDetailsProps> = ({
  tokenPair,
  dex,
  voter,
}) => {
  const { t } = useTranslation(['common', 'vote']);
  const { data: bakers } = useBakers();
  const currentCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (dex?.storage?.storage) {
      return bakers.find((x) => x.address === dex.storage.storage.current_candidate)
      || {
        address: dex.storage.storage.current_candidate,
      } as WhitelistedBaker;
    }
    return undefined;
  }, [dex, bakers]);

  const secondCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (dex?.storage?.storage) {
      return bakers.find((x) => x.address === dex.storage.storage.current_delegated)
      || {
        address: dex.storage.storage.current_delegated,
      } as WhitelistedBaker;
    }
    return undefined;
  }, [dex, bakers]);

  const myCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (voter?.candidate) {
      return bakers.find((x) => x.address === voter?.candidate);
    }
    return undefined;
  }, [voter, bakers]);

  const totalVotes = useMemo(() => {
    if (dex?.storage?.storage) {
      return fromDecimals(dex.storage.storage.total_votes, TEZOS_TOKEN.metadata.decimals).toFixed();
    }
    return '';
  }, [dex]);

  const totalVeto = useMemo(() => {
    if (dex?.storage?.storage) {
      return fromDecimals(dex.storage.storage.veto, TEZOS_TOKEN.metadata.decimals).toFixed();
    }
    return '';
  }, [dex]);

  const votesToVeto = useMemo(() => {
    if (dex?.storage?.storage) {
      return fromDecimals(dex.storage.storage.total_votes, TEZOS_TOKEN.metadata.decimals)
        .div(3)
        .minus(fromDecimals(dex.storage.storage.veto, TEZOS_TOKEN.metadata.decimals))
        .toFixed(6);
    }
    return '';
  }, [dex]);

  const pairLink = useMemo(() => (tokenPair.dex && `https://analytics.quipuswap.com/pairs/${tokenPair.dex?.contract.address}`), [tokenPair.dex]);

  return (
    <Card
      header={{
        content: 'Voting Details',
      }}
      contentClassName={s.content}
    >
      <CardCell
        header={(
          <>
            {t('vote|Delegated To')}
            <Tooltip
              sizeT="small"
              content={t('vote|Current baker elected by simple majority of votes.')}
            />
          </>
            )}
        className={cx(s.cellCenter, s.cell)}
      >
        {currentCandidate ? (
          <Button
            href={`https://tzkt.io/${currentCandidate.address}`}
            external
            theme="underlined"
            title={getWhitelistedBakerName(currentCandidate)}
          >
            {getWhitelistedBakerName(currentCandidate)}
          </Button>
        ) : '—'}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('vote|Second Candidate')}
            <Tooltip
              sizeT="small"
              content={t('vote|The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.')}
            />
          </>
            )}
        className={cx(s.cellCenter, s.cell)}
      >
        {secondCandidate ? (
          <Button
            href={`https://tzkt.io/${secondCandidate.address}`}
            external
            theme="underlined"
            title={getWhitelistedBakerName(secondCandidate)}
          >
            {getWhitelistedBakerName(secondCandidate)}
          </Button>
        ) : '—'}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('vote|Total Votes')}
            <Tooltip
              sizeT="small"
              content={t('vote|The total amount of votes cast to elect a baker in the pool.')}
            />
          </>
            )}
        className={cx(s.cellCenter, s.cell)}
      >
        <CurrencyAmount amount={totalVotes} />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('vote|Total Vetos')}
            <Tooltip
              sizeT="small"
              content={t('vote|The total amount of shares cast so far to veto the current baker.')}
            />
          </>
            )}
        className={cx(s.cellCenter, s.cell)}
      >
        <CurrencyAmount amount={totalVeto} />
      </CardCell>
      <CardCell
        header={(
          <>
            {t('vote|Your Candidate')}
            <Tooltip
              sizeT="small"
              content={t('vote|The candidate you voted for.')}
            />
          </>
        )}
        className={cx(s.cellCenter, s.cell)}
      >
        {myCandidate ? (
          <Button
            href={`https://tzkt.io/${myCandidate.address}`}
            external
            theme="underlined"
            title={getWhitelistedBakerName(myCandidate)}
          >
            {getWhitelistedBakerName(myCandidate)}
          </Button>
        ) : '—'}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('Votes To Veto Left')}
            <Tooltip
              sizeT="small"
              content={t('vote|This much more votes needed to veto a delegate.')}
            />
          </>
            )}
        className={cx(s.cellCenter, s.cell)}
      >
        <CurrencyAmount amount={votesToVeto} />
      </CardCell>
      {tokenPair.dex && (
      <div className={s.detailsButtons}>
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={pairLink}
          external
          icon={<ExternalLink className={s.linkIcon} />}
        >
          {t('vote|Pair Analytics')}
        </Button>
        {/* <Button
          className={s.detailsButton}
          theme="inverse"
          href="#"
          icon={<ExternalLink className={s.linkIcon} />}
        >
          Delegation Analytics
        </Button> */}
      </div>
      )}
    </Card>
  );
};
