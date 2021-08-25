import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import {
  FoundDex,
} from '@quipuswap/sdk';

import { useBakers } from '@utils/dapp';
import {
  VoterType, WhitelistedBaker, WhitelistedTokenPair,
} from '@utils/types';
import { Tooltip } from '@components/ui/Tooltip';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';

import s from '@styles/CommonContainer.module.sass';

type VotingDetailsProps = {
  tokenPair: WhitelistedTokenPair
  dex: FoundDex
  voter: VoterType
};

function sharesFromNat(val: BigNumber.Value) {
  return new BigNumber(val).div(10 ** 6);
}

export const VotingDetails: React.FC<VotingDetailsProps> = ({
  tokenPair,
  dex,
  voter,
}) => {
  const { t } = useTranslation(['common', 'vote']);
  const { data: bakers } = useBakers();
  const currentCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (dex?.storage?.storage) {
      return bakers.find((x) => x.address === dex.storage.storage.current_candidate);
    }
    return {} as WhitelistedBaker;
  }, [dex, bakers]);

  const secondCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (dex?.storage?.storage) {
      return bakers.find((x) => x.address === dex.storage.storage.current_delegated);
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
      return sharesFromNat(dex.storage.storage.total_votes).toFixed();
    }
    return '';
  }, [dex, bakers]);

  const totalVeto = useMemo(() => {
    if (dex?.storage?.storage) {
      return sharesFromNat(dex.storage.storage.veto).toFixed();
    }
    return '';
  }, [dex]);

  const votesToVeto = useMemo(() => {
    if (dex?.storage?.storage) {
      return sharesFromNat(dex.storage.storage.total_votes)
        .div(3)
        .minus(sharesFromNat(dex.storage.storage.veto))
        .toFixed(6);
    }
    return '';
  }, [dex]);

  const pairLink = useMemo(() => (tokenPair.dex
    ? `https://analytics.quipuswap.com/pairs/${tokenPair.dex?.contract.address}`
    : '#'), [tokenPair.dex]);

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
            {t('vote:Delegated To')}
            <Tooltip
              sizeT="small"
              content={t('vote:Current baker elected by simple majority of votes.')}
            />
          </>
            )}
        className={s.cell}
      >
        <Button href={currentCandidate ? `https://tzkt.io/${currentCandidate.address}` : '#'} theme="underlined">
          {currentCandidate?.name}
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
        <Button href={secondCandidate ? `https://tzkt.io/${secondCandidate.address}` : '#'} theme="underlined">
          {secondCandidate?.name}
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
        <CurrencyAmount amount={totalVotes} />
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
        <CurrencyAmount amount={totalVeto} />
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
        <Button href={myCandidate ? `https://tzkt.io/${myCandidate.address}` : '#'} theme="underlined">
          {myCandidate?.name}
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
        <CurrencyAmount amount={votesToVeto} />
      </CardCell>
      <div className={s.detailsButtons}>
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={pairLink}
        >
          Pair Analytics
          <ExternalLink className={s.linkIcon} />
        </Button>
        <Button
          className={s.detailsButton}
          theme="inverse"
          href="#"
        >
          Delegation Analytics
          <ExternalLink className={s.linkIcon} />
        </Button>
      </div>
    </Card>
  );
};
