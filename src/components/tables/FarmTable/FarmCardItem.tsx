import React, { useContext } from 'react';

import { Bage, Button, ColorModes, TokensLogos, CurrencyAmount, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { WhitelistedFarm } from '@utils/types';

import s from './FarmCardTable.module.sass';

type FarmCardItemProps = {
  farm: WhitelistedFarm;
  isSponsored?: boolean;
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const FarmCardItem: React.FC<FarmCardItemProps> = ({ farm, isSponsored }) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos
            firstTokenIcon={prepareTokenLogo(farm.tokenPair.token1.metadata.thumbnailUri)}
            firstTokenSymbol={getWhitelistedTokenSymbol(farm.tokenPair.token1)}
            secondTokenIcon={prepareTokenLogo(farm.tokenPair.token2.metadata.thumbnailUri)}
            secondTokenSymbol={getWhitelistedTokenSymbol(farm.tokenPair.token2)}
            className={s.tokenLogo}
          />
          {getWhitelistedTokenSymbol(farm.tokenPair.token1)}/{getWhitelistedTokenSymbol(farm.tokenPair.token2)}
        </div>
        {isSponsored && <Bage text="Sponsored" />}
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>{t('home|Total Staked')}</div>
        <div className={cx(s.bold, s.cardCellText)}>
          <CurrencyAmount amount="888888888888888.00" currency="$" isLeftCurrency className={s.cardAmount} />
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>{t('home|APR')}</div>
        <div className={cx(s.bold, s.cardCellText)}>
          <CurrencyAmount amount="888888888888888.00" currency="$" isLeftCurrency className={s.cardAmount} />
        </div>
      </div>
      <div className={cx(s.links, s.cardCellItem, s.buttons)}>
        <Button theme="secondary" className={s.button} href="#">
          Get LP
        </Button>
        <Button href="/swap" className={s.button}>
          Farm
        </Button>
      </div>
    </div>
  );
};
