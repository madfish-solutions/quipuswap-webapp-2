import { useContext } from 'react';

import { Bage, Button, Tooltip, ColorModes, TokensLogos, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';
import { calculateRateAmount, getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { PoolTableType } from '@utils/types';

import { getHref } from './get-swap-href.helper';
import s from './PoolCardTable.module.sass';

interface PoolCardItemProps {
  pool: PoolTableType;
  isSponsored?: boolean;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PoolCardItem: React.FC<PoolCardItemProps> = ({ pool, isSponsored }) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  const tvl = calculateRateAmount(pool.data.tvl, pool.xtzUsdQuote);
  const volume24h = calculateRateAmount(pool.data.volume24h, pool.xtzUsdQuote);

  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos
            firstTokenIcon={prepareTokenLogo(pool.token1.metadata.thumbnailUri)}
            firstTokenSymbol={getWhitelistedTokenSymbol(pool.token1)}
            secondTokenIcon={prepareTokenLogo(pool.token2.metadata.thumbnailUri)}
            secondTokenSymbol={getWhitelistedTokenSymbol(pool.token2)}
            className={s.tokenLogo}
          />
          {pool.pair.name}
        </div>
        {isSponsored && <Bage text={t('home|Sponsored')} />}
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home|TVL')}
          <Tooltip
            sizeT="small"
            content={t(
              'TVL (Total Value Locked) represents the total amount of a specific token locked on QuipuSwap across different pools.'
            )}
          />
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          <StateCurrencyAmount amount={tvl} currency="$" isLeftCurrency className={s.cardAmount} />
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home|Volume 24h')}
          <Tooltip sizeT="small" content={t('A total amount of funds that were swapped via each pool today.')} />
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          <StateCurrencyAmount amount={volume24h} currency="$" isLeftCurrency className={s.cardAmount} />
        </div>
      </div>
      <div className={cx(s.links, s.cardCellItem, s.buttons)}>
        <Button theme="secondary" className={s.button} href={pool.buttons.first.href} external>
          {t('home|Analytics')}
        </Button>
        <Button href={getHref(pool)} className={s.button}>
          {t('home|Trade')}
        </Button>
      </div>
    </div>
  );
};
