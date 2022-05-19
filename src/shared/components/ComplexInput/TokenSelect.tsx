import { FC, HTMLProps, useContext, useMemo, useRef, useState } from 'react';

import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { Danger } from '@shared/elements';
import {
  formatBalance,
  getMessageNotWhitelistedToken,
  getTokenSlug,
  getTokenSymbol,
  isExist,
  prepareTokenLogo,
  getTokenInputAmountCap
} from '@shared/helpers';
import { Shevron } from '@shared/svg';
import { Nullable, Token } from '@shared/types';
import { useTranslation } from '@translation';

import { Button } from '../button';
import { ComplexError } from '../complex-error';
import { DashPlug } from '../dash-plug';
import { PercentSelector } from '../percent-selector';
import { Scaffolding } from '../scaffolding';
import { Balance } from '../state-components/balance';
import { TokensLogosDeprecated } from '../tokens-logos-deprecated';
import { TokensModal } from '../TokensModal';
import s from './ComplexInput.module.scss';

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

export const TokenSelect: FC<TokenSelectProps> = ({
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
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState(false);
  const [focused, setActive] = useState(false);
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

  const equivalentContent = dollarEquivalent ? `= $ ${formatBalance(dollarEquivalent)}` : '';

  const disabled = !isExist(balance) || !isExist(token);

  const firstTokenIcon = token ? prepareTokenLogo(token.metadata?.thumbnailUri) : null;
  const firstTokenSymbol = token ? getTokenSymbol(token) : 'TOKEN';
  const tokenSelectSymbol = token ? getTokenSymbol(token) : 'SELECT';
  const tokenLabel = tokensLoading ? <DashPlug zoom={1.45} animation /> : tokenSelectSymbol;

  const notWhitelistedMessage = token ? getMessageNotWhitelistedToken(token) : null;

  return (
    <>
      <div
        className={compoundClassName}
        onClick={focusInput}
        onKeyPress={focusInput}
        role="button"
        tabIndex={0}
        {...props}
      >
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
                  data-test-id="tokenSelectButton"
                >
                  <TokensLogosDeprecated firstTokenIcon={firstTokenIcon} firstTokenSymbol={firstTokenSymbol} />
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
