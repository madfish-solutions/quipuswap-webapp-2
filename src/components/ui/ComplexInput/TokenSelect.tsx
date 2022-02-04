import { HTMLProps, useContext, useMemo, useRef, useState } from 'react';

import { ColorModes, ColorThemeContext, Shevron } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';
import cx from 'classnames';

import { TokensLogos } from '@components/common/TokensLogos';
import { TokensModal } from '@components/modals/TokensModal';
import { Scaffolding } from '@components/scaffolding';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { useAccountPkh } from '@utils/dapp';
import { getTokenInputAmountCap, getTokenSymbol, isExist, prepareTokenLogo, prettyPrice } from '@utils/helpers';
import { Nullable, WhitelistedToken } from '@utils/types';

import { DashPlug } from '../dash-plug';
import { Button } from '../elements/button';
import { Balance } from '../state-components/balance';
import s from './ComplexInput.module.sass';

const DEFAULT_EXCHANGE_RATE = 0;
const NO_CAP_AMOUNT = new BigNumber('0');

interface TokenSelectProps extends HTMLProps<HTMLInputElement> {
  shouldShowBalanceButtons?: boolean;
  className?: string;
  balance: Nullable<string>;
  exchangeRate?: string;
  label: string;
  error?: string;
  notSelectable?: boolean;
  handleChange?: (token: WhitelistedToken) => void;
  handleBalance: (value: string) => void;
  token: Nullable<WhitelistedToken>;
  token2?: Nullable<WhitelistedToken>;
  tokensLoading?: boolean;
  blackListedTokens: WhitelistedToken[];
  setToken?: (token: WhitelistedToken) => void;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const TokenSelect: React.FC<TokenSelectProps> = ({
  className,
  balance = null,
  shouldShowBalanceButtons = true,
  label,
  handleBalance,
  exchangeRate = null,
  notSelectable = false,
  value,
  error,
  id,
  handleChange,
  token,
  token2,
  setToken,
  blackListedTokens,
  tokensLoading,
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

  const secondTokenIcon = token2 ? prepareTokenLogo(token2.metadata.thumbnailUri) : token2;
  const secondTokenSymbol = token2 ? getTokenSymbol(token2) : null;

  const amountCap = token2 ? NO_CAP_AMOUNT : getTokenInputAmountCap(token);

  return (
    <>
      <div className={compoundClassName} onClick={focusInput} onKeyPress={focusInput} role="button" tabIndex={0}>
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        <div className={s.background}>
          <div className={s.shape}>
            <div className={cx(s.item1, s.label2)}>{equivalentContent}</div>
            <div className={s.item2}>{account && <Balance balance={balance} colorMode={colorThemeMode} />}</div>
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
            <Button
              disabled={notSelectable}
              onClick={() => !notSelectable && setTokensModal(true)}
              theme="quaternary"
              className={s.item4}
              textClassName={s.item4Inner}
            >
              <TokensLogos
                firstTokenIcon={firstTokenIcon}
                firstTokenSymbol={firstTokenSymbol}
                secondTokenIcon={secondTokenIcon}
                secondTokenSymbol={secondTokenSymbol}
              />
              <h6 className={cx(s.token)}>
                {tokensLoading ? (
                  <DashPlug zoom={1.45} animation />
                ) : (
                  <>
                    {token ? getTokenSymbol(token) : 'SELECT'}
                    {token2 && ` / ${getTokenSymbol(token2)}`}
                  </>
                )}
              </h6>
              {!notSelectable && <Shevron />}
            </Button>
          </div>
        </div>
        <Scaffolding showChild={shouldShowBalanceButtons} className={s.scaffoldingPercentSelector}>
          <PercentSelector amountCap={amountCap} value={balance} handleBalance={handleBalance} />
        </Scaffolding>
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
