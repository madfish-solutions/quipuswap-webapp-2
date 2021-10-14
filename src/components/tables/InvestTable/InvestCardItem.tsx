import React, { useContext } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Button } from '@components/ui/Button';
import { Bage } from '@components/ui/Bage';
import { CurrencyAmount } from '@components/common/CurrencyAmount';

import s from '../Card.module.sass';

type InvestCardItemProps = {
  isSponsored?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const InvestCardItem: React.FC<InvestCardItemProps> = ({
  isSponsored,
}) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos
            token1={TEZOS_TOKEN}
            token2={STABLE_TOKEN}
            className={s.tokenLogo}
          />
          {TEZOS_TOKEN.metadata.symbol}
          /
          {STABLE_TOKEN.metadata.symbol}
        </div>
        {isSponsored && (<Bage text={t('home|Sponsored')} />)}
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home|Your Share')}
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
          %
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home|Your LP Balance')}
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
          LP
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>
          {t('home|Your Liquidity')}
        </div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount
            className={s.cardAmount}
            amount="888"
          />
        </div>
      </div>
      <div className={cx(s.links, s.cardCellItem, s.buttons)}>
        <Button
          theme="secondary"
          className={s.button}
          href="#"
          external
        >
          {t('home|Remove')}
        </Button>
        <Button
          href="/swap"
          className={s.button}
        >
          {t('home|Add')}
        </Button>
      </div>
    </div>
  );
};
