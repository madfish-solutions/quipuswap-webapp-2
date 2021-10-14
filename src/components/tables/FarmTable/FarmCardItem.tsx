import React, { useContext } from 'react';
import cx from 'classnames';
import { WhitelistedFarm } from '@utils/types';
import { useTranslation } from 'next-i18next';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { getWhitelistedTokenSymbol } from '@utils/helpers';
import { TokensLogos } from '@components/ui/TokensLogos';
import { CurrencyAmount } from '@components/common/CurrencyAmount';
import { Button } from '@components/ui/Button';
import { Bage } from '@components/ui/Bage';

import s from '../Card.module.sass';

type FarmCardItemProps = {
  farm: WhitelistedFarm
  isSponsored?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const FarmCardItem: React.FC<FarmCardItemProps> = ({
  farm,
  isSponsored,
}) => {
  const { t } = useTranslation(['home']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  return (
    <div className={cx(modeClass[colorThemeMode], s.card)}>
      <div className={cx(s.cardCellItem, s.tokenLogoBlock)}>
        <div className={s.links}>
          <TokensLogos
            token1={farm.tokenPair.token1}
            token2={farm.tokenPair.token2}
            className={s.tokenLogo}
          />
          {getWhitelistedTokenSymbol(farm.tokenPair.token1)}
          /
          {getWhitelistedTokenSymbol(farm.tokenPair.token2)}
        </div>
        {isSponsored && (<Bage text="Sponsored" />)}
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>{t('home|Your Stake')}</div>
        <div className={cx(s.bold, s.cardCellText)}>
          <CurrencyAmount amount="888" className={s.cardAmount} />
          LP
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>{t('home|Pending Reward')}</div>
        <div className={cx(s.bold, s.cardCellText)}>
          <CurrencyAmount amount="888" className={s.cardAmount} />
          TOKEN
        </div>
      </div>
      <div className={cx(s.textItem, s.cardCellItem)}>
        <div className={s.cardCellText}>{t('home|Total Value')}</div>
        <div className={cx(s.bold, s.cardCellText)}>
          $
          <CurrencyAmount amount="888" className={s.cardAmount} />
        </div>
      </div>
      <div className={cx(s.links, s.cardCellItem, s.buttons)}>

        <Button
          theme="secondary"
          className={s.button}
          href="#"
        >
          Get LP
        </Button>
        <Button
          href="/swap"
          className={s.button}
        >
          Farm
        </Button>
      </div>
    </div>
  );
};
