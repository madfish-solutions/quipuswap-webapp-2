import React, { useContext, useMemo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { FoundDex } from '@quipuswap/sdk';

import { WhitelistedBaker } from '@utils/types';
import { getWhitelistedBakerName } from '@utils/helpers';
import { useBakers } from '@utils/dapp';
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
  amount: string,
  remaining: Date
  dex?: FoundDex
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const FarmingDetails: React.FC<FarmingDetailsProps> = ({
  remaining,
  amount,
  dex,
}) => {
  console.log(dex);
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
            <CurrencyAmount amount={amount} />
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
            888 %
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
            0.008 %
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
        <Timeleft remaining={remaining} className={s.priceAmount} />
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
        <Timeleft remaining={remaining} className={s.priceAmount} />
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
          theme="inverse"
          icon={
            <ExternalLink className={s.linkIcon} />
              }
        >
          Pair Analytics
        </Button>
        <Button
          className={s.detailsButton}
          theme="inverse"
          icon={
            <ExternalLink className={s.linkIcon} />
              }
        >
          Farm Contract
        </Button>
      </div>
      <div className={s.detailsButtons}>
        <Button
          className={s.detailsButton}
          theme="inverse"
          icon={
            <ExternalLink className={s.linkIcon} />
              }
        >
          Token Contract
        </Button>
        <Button
          className={s.detailsButton}
          theme="inverse"
          icon={
            <ExternalLink className={s.linkIcon} />
              }
        >
          Project
        </Button>
      </div>
    </Card>
  );
};
