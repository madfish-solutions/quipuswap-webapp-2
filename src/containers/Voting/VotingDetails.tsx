import React, { useMemo } from 'react';
import {
  Card,
  Button,
  Tooltip,
  CardCell,
  ExternalLink,
  CurrencyAmount,
} from '@quipuswap/ui-kit';
import { useTranslation } from 'next-i18next';
import { FoundDex } from '@quipuswap/sdk';
import cx from 'classnames';

import {
  VoterType,
  WhitelistedBaker,
  WhitelistedTokenPair,
} from '@utils/types';
import { fromDecimals, getWhitelistedBakerName } from '@utils/helpers';
import { TEZOS_TOKEN } from '@utils/defaults';
import { useBakers } from '@utils/dapp';

import s from '@styles/CommonContainer.module.sass';

type VotingDetailsProps = {
  tokenPair: WhitelistedTokenPair;
  dex?: FoundDex;
  voter?: VoterType;
};

export const VotingDetails: React.FC<VotingDetailsProps> = ({
  tokenPair,
  dex,
  voter,
}) => {
  const { t } = useTranslation(['common', 'vote']);
  const { data: bakers } = useBakers();

  const currentCandidate: WhitelistedBaker | undefined = useMemo(() => (dex?.storage?.storage ? (
    bakers.find(
      (x) => x.address === dex.storage.storage.current_candidate,
    )
      || ({
        address: dex.storage.storage.current_candidate,
      })
  ) : undefined), [dex, bakers]);

  const secondCandidate: WhitelistedBaker | undefined = (dex?.storage?.storage ? (
    bakers.find(
      (x) => x.address === dex.storage.storage.current_delegated,
    ) || ({
      address: dex.storage.storage.current_delegated,
    })
  ) : undefined);

  // eslint-disable-next-line max-len
  const myCandidate: WhitelistedBaker | undefined = (voter?.candidate ? bakers.find((x) => x.address === voter?.candidate) : undefined);

  const totalVotes = (dex?.storage?.storage ? fromDecimals(
    dex.storage.storage.total_votes,
    TEZOS_TOKEN.metadata.decimals,
  ).toFixed() : '');

  const totalVeto = (dex?.storage?.storage ? fromDecimals(
    dex.storage.storage.veto,
    TEZOS_TOKEN.metadata.decimals,
  ).toFixed() : '');

  const votesToVeto = (dex?.storage?.storage ? fromDecimals(
    dex.storage.storage.total_votes,
    TEZOS_TOKEN.metadata.decimals,
  )
    .div(3)
    .minus(
      fromDecimals(dex.storage.storage.veto, TEZOS_TOKEN.metadata.decimals),
    )
    .toFixed(6) : '');

  const pairLink = tokenPair.dex
      && `https://analytics.quipuswap.com/pairs/${tokenPair.dex?.contract.address}`;
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
              content={t(
                'vote|Current baker elected by simple majority of votes.',
              )}
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
        ) : (
          '—'
        )}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('vote|Second Candidate')}
            <Tooltip
              sizeT="small"
              content={t(
                'vote|The candidate who garnered second largest number of votes. If the current baker gets vetoed, the second candidate will assume his place.',
              )}
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
        ) : (
          '—'
        )}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('vote|Total Votes')}
            <Tooltip
              sizeT="small"
              content={t(
                'vote|The total amount of votes cast to elect a baker in the pool.',
              )}
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
              content={t(
                'vote|The total amount of shares cast so far to veto the current baker.',
              )}
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
        ) : (
          '—'
        )}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('Votes To Veto Left')}
            <Tooltip
              sizeT="small"
              content={t(
                'vote|This much more votes needed to veto a delegate.',
              )}
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
      </div>
      )}
    </Card>
  );
};
