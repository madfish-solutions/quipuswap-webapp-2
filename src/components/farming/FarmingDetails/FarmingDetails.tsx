import React, { useContext, useMemo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { FoundDex } from '@quipuswap/sdk';

import { WhitelistedBaker, WhitelistedFarm } from '@utils/types';
import { getWhitelistedBakerName, prettyPrice } from '@utils/helpers';
import { useBakers } from '@utils/dapp';
import { prettyPercentage } from '@utils/helpers/prettyPercentage';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Tooltip } from '@components/ui/Tooltip';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { CardCell } from '@components/ui/Card/CardCell';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { ExternalLink } from '@components/svg/ExternalLink';
import { Timeleft } from '@components/ui/Timeleft';

import s from './FarmingDetails.module.sass';

type FarmingDetailsProps = {
  farm: WhitelistedFarm
  dex?: FoundDex
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const FarmingDetails: React.FC<FarmingDetailsProps> = ({
  farm,
  dex,
}) => {
  const {
    totalValueLocked,
    apyDaily,
    tokenContract,
    farmContract,
    analyticsLink,
    startTime,
    timelock,
  } = farm;
  const { t } = useTranslation(['common', 'farms']);
  const { data: bakers } = useBakers();
  const currentCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (dex?.storage?.storage) {
      if (!dex.storage.storage.current_candidate) return undefined;
      return bakers.find((x) => x.address === dex.storage.storage.current_candidate)
      || {
        address: dex.storage.storage.current_candidate ?? '',
      } as WhitelistedBaker;
    }
    return undefined;
  }, [dex, bakers]);

  const secondCandidate: WhitelistedBaker | undefined = useMemo(() => {
    if (dex?.storage?.storage) {
      if (!dex.storage.storage.current_delegated) return undefined;
      return bakers.find((x) => x.address === dex.storage.storage.current_delegated)
      || {
        address: dex.storage.storage.current_delegated,
      } as WhitelistedBaker;
    }
    return undefined;
  }, [dex, bakers]);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const remaining:Date = useMemo(() => new Date(
    new Date(startTime).getTime() + new Date(timelock).getTime(),
  ), [startTime, timelock]);
  return (
    <Card
      header={{
        content: 'Farm Details',
      }}
      contentClassName={cx(modeClass[colorThemeMode], s.content)}
    >
      <CardCell
        header={(
          <>
            {t('common|Value Locked')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          $
          {' '}
          <span className={s.priceAmount}>
            <CurrencyAmount amount={prettyPrice(+totalValueLocked)} />
          </span>
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|APR')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <span className={s.priceAmount}>
            {prettyPercentage(apyDaily)}
          </span>
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Daily')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <span className={s.priceAmount}>
            {prettyPercentage(apyDaily.dividedBy(365))}
          </span>
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Current Delegate')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
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
            {t('common|Next Delegate')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
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
            {t('common|Ends in')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
      >
        {timelock === '0' ? '—' : (
          <Timeleft
            remaining={remaining}
            disabled
            className={s.priceAmount}
          />
        )}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Lock Period')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
      >
        {timelock === '0' ? '—' : (
          <Timeleft
            remaining={new Date(Date.now() + (+timelock.toString()))}
            disabled
            className={s.priceAmount}
          />
        )}
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Withdrawal Fee')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <span className={s.priceAmount}>
            888 %
          </span>
        </div>
      </CardCell>
      <CardCell
        header={(
          <>
            {t('common|Interface Fee')}
            <Tooltip
              sizeT="small"
              content={t('common|TOOLTIP TODO')}
            />
          </>
            )}
        className={s.cell}
      >
        <div className={s.cellAmount}>
          <span className={s.priceAmount}>
            888 %
          </span>
        </div>
      </CardCell>
      <div className={s.detailsButtons}>
        <Button
          className={s.detailsButton}
          href={analyticsLink}
          external
          theme="inverse"
          icon={
            <ExternalLink className={s.linkIcon} />
              }
        >
          {t('common|Pair Analytics')}
        </Button>
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={farmContract}
          external
          icon={
            <ExternalLink className={s.linkIcon} />
              }
        >
          {t('common|Farm Contract')}
        </Button>
      </div>
      <div className={s.detailsButtons}>
        <Button
          className={s.detailsButton}
          theme="inverse"
          href={tokenContract}
          external
          icon={
            <ExternalLink className={s.linkIcon} />
              }
        >
          {t('common|Token Contract')}
        </Button>
      </div>
    </Card>
  );
};
