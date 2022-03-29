import { HTMLProps, useContext, useMemo, useRef, useState } from 'react';

import { ColorModes, ColorThemeContext, Shevron } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { TokensLogos } from '@shared/components/tokens-logos';
import { TokensModal } from '@shared/modals/tokens-modal';
import { Scaffolding } from '@shared/components/scaffolding';
import { ComplexError } from '.';
import { PercentSelector } from '.';
import { useAccountPkh } from '@providers';
import { prettyPrice } from '@shared/helpers/pretty-price';
import { prepareTokenLogo } from '@shared/helpers/prepare-token-logo';
import { isExist } from '@shared/helpers/type-checks';
import { getTokenInputAmountCap } from '@shared/helpers/get-token-input-amount-cap';
import { getTokenSymbol } from '@shared/helpers/get-token-appellation';
import { getTokenSlug } from '@shared/helpers/get-token-slug';
import { getMessageNotWhitelistedToken } from '@shared/helpers/is-whitelisted-token';
import { Nullable, Token } from 'types/types';

import { Danger } from '@shared/components/danger';
import { DashPlug } from '@shared/components/dash-plug';
import { Button } from '@shared/components/button';
import { Balance } from '@shared/components/balance';
import s from './complex-input.module.sass';

const DEFAULT_EXCHANGE_RATE = 0;

interface TokenSelectProps extends HTMLProps<HTMLInputElement> {
  shouldShowBalanceButtons?: boolean;
  shouldHideTokenSelect?: boolean;
  className?: string;
  balance: Nullable<string>;
  exchangeRate?: string;
  label: string;
  error?: string;
  notSelectable?: boolean;
  handleChange?: (token: Token) => void;
  handleBalance?: (value: string) => void;
  showBuyButton?: boolean;
  tokenInputAmountCap?: BigNumber;
  token: Nullable<Token>;
  tokensLoading?: boolean;
  blackListedTokens: Token[];
  setToken?: (token: Token) => void;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const TokenSelect: React.FC<TokenSelectProps> = ({
  className,
  balance = null,
  shouldShowBalanceButtons = true,
  shouldHideTokenSelect,
  label,
  handleBalance,
  exchangeRate = null,
  notSelectable = false,
  value,
  error,
  id,
  handleChange,
  showBuyButton,
  token,
  setToken,
  blackListedTokens,
  tokensLoading,
  tokenInputAmountCap,
  ...props
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const [focused, setActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const account = useAccountPkh();

  const dollarEquivalent = useMemo(
    () =>
      exchangeRate
        ? new BigNumber(value ? value.toString() : DEFAULT_EXCHANGE_RATE)
            .multipliedBy(new BigNumber(exchangeRate))
            .toString()
        : '',
    [exchangeRate, value]
  );

  const compoundClassName = cx({ [s.focused]: focused }, { [s.error]: !!error }, themeClass[colorThemeMode], className);

  const focusInput = () => {
    inputRef?.current?.focus();
  };

  const equivalentContent = dollarEquivalent ? `= $ ${prettyPrice(parseFloat(dollarEquivalent))}` : '';

  const disabled = !isExist(balance) || !isExist(token);

  const firstTokenIcon = token ? prepareTokenLogo(token.metadata?.thumbnailUri) : null;
  const firstTokenSymbol = token ? getTokenSymbol(token) : 'TOKEN';
  const tokenSelectSymbol = token ? getTokenSymbol(token) : 'SELECT';
  const tokenLabel = tokensLoading ? <DashPlug zoom={1.45} animation /> : tokenSelectSymbol;

  const notWhitelistedMessage = token ? getMessageNotWhitelistedToken(token) : null;

  return (
    <>
      <div className={compoundClassName} onClick={focusInput} onKeyPress={focusInput} role="button" tabIndex={0}>
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        <div className={s.background}>
          <div className={s.shape}>
            <div className={cx(s.item1, s.label2)}>{equivalentContent}</div>
            <div className={s.item2}>
              {showBuyButton && token && (
                <Button
                  href={`/swap/tez-${getTokenSlug(token)}`}
                  theme="quaternary"
                  className={s.actionButton}
                  textClassName={s.actionButtonText}
                >
                  {t('common|Buy')}
                </Button>
              )}
              {account && (
                <Balance
                  balance={balance}
                  unit={shouldHideTokenSelect ? tokenSelectSymbol : undefined}
                  colorMode={colorThemeMode}
                />
              )}
              {shouldHideTokenSelect && !account && (
                <Balance balance="0" unit={tokenSelectSymbol} colorMode={colorThemeMode} />
              )}
            </div>
            <input
              className={cx(s.item3, s.input)}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              ref={inputRef}
              value={value}
              autoComplete="off"
              disabled={disabled || props.disabled}
              {...props}
            />
            {!shouldHideTokenSelect && (
              <div className={s.dangerContainer}>
                {notWhitelistedMessage && <Danger content={notWhitelistedMessage} />}
                <Button
                  disabled={notSelectable}
                  onClick={() => !notSelectable && setTokensModal(true)}
                  theme="quaternary"
                  className={s.item4}
                  textClassName={s.item4Inner}
                >
                  <TokensLogos firstTokenIcon={firstTokenIcon} firstTokenSymbol={firstTokenSymbol} />
                  <h6 className={cx(s.token)}>{tokenLabel}</h6>
                  {!notSelectable && <Shevron />}
                </Button>
              </div>
            )}
          </div>
        </div>
        {handleBalance ? (
          <Scaffolding showChild={shouldShowBalanceButtons} className={s.scaffoldingPercentSelector}>
            <PercentSelector
              amountCap={tokenInputAmountCap ?? getTokenInputAmountCap(token)}
              value={balance}
              handleBalance={handleBalance}
            />
          </Scaffolding>
        ) : null}
        <ComplexError error={error} />
      </div>
      {tokensModal && (
        <TokensModal
          blackListedTokens={blackListedTokens}
          isOpen={tokensModal}
          onRequestClose={() => setTokensModal(false)}
          onChange={selectedToken => {
            setToken?.(selectedToken);
            handleChange?.(selectedToken);
            setTokensModal(false);
          }}
        />
      )}
    </>
  );
};
