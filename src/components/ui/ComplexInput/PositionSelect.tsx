import { Dispatch, FC, Fragment, HTMLProps, SetStateAction, useContext, useEffect, useRef, useState } from 'react';

import { ColorModes, ColorThemeContext, Shevron } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TEZOS_TOKEN } from '@app.config';
import { TokensLogos } from '@components/common/TokensLogos';
import { PositionsModal } from '@components/modals/PositionsModal';
import { Scaffolding } from '@components/scaffolding';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { Nullable, RawToken, TokenPair } from '@interfaces/types';
import { getTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { getMessageNotWhitelistedTokenPair } from '@utils/helpers/is-whitelisted-token';

import { Danger } from '../components/danger';
import { DashPlug } from '../dash-plug';
import { Button } from '../elements/button';
import { Balance } from '../state-components/balance';
import s from './ComplexInput.module.sass';

interface PositionSelectProps extends HTMLProps<HTMLInputElement> {
  shouldShowBalanceButtons?: boolean;
  className?: string;
  balance?: Nullable<string>;
  balanceLabel?: string;
  frozenBalance?: string;
  notFrozen?: boolean;
  label: string;
  error?: string;
  notSelectable1?: RawToken;
  notSelectable2?: RawToken;
  handleChange?: (tokenPair: TokenPair) => void;
  handleBalance: (value: string) => void;
  tokenPair: Nullable<TokenPair>;
  setTokenPair: (tokenPair: TokenPair) => void;
  tokensUpdating?: {
    isTokenChanging: boolean;
    setIsTokenChanging: Dispatch<SetStateAction<boolean>>;
  };
  isPoolNotExists?: boolean;
}

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const PositionSelect: FC<PositionSelectProps> = ({
  className,
  balance,
  shouldShowBalanceButtons = true,
  frozenBalance,
  label,
  balanceLabel,
  handleBalance,
  value,
  error,
  id,
  handleChange,
  notSelectable1 = undefined,
  notSelectable2 = undefined,
  tokenPair,
  setTokenPair,
  notFrozen,
  tokensUpdating,
  isPoolNotExists,
  ...props
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { t } = useTranslation(['common']);
  const { colorThemeMode } = useContext(ColorThemeContext);
  const [tokensModal, setTokensModal] = useState<boolean>(false);
  const [focused, setActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const compoundClassName = cx({ [s.focused]: focused }, { [s.error]: !!error }, themeClass[colorThemeMode], className);

  const focusInput = () => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  const token1 = tokenPair?.token1 ?? TEZOS_TOKEN;
  const token2 = tokenPair?.token2 ?? TEZOS_TOKEN;
  useEffect(() => {
    if (tokensUpdating && tokenPair?.token2) {
      tokensUpdating.setIsTokenChanging(false);
    }
    // eslint-disable-next-line
  }, [tokenPair?.token2]);

  const isTokensLoading = tokensUpdating?.isTokenChanging;

  const notWhitelistedMessage = getMessageNotWhitelistedTokenPair(token1, token2);

  const wrapFrozenBalance = isPoolNotExists ? undefined : frozenBalance ?? null;
  const wrapAvailableBalance = isPoolNotExists ? undefined : balance ?? null;

  return (
    <>
      <PositionsModal
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={selectedToken => {
          tokensUpdating?.setIsTokenChanging(true);
          setTokenPair(selectedToken);
          if (handleChange) {
            handleChange(selectedToken);
          }
          setTokensModal(false);
        }}
        initialPair={tokenPair}
        notSelectable1={notSelectable1}
        notSelectable2={notSelectable2}
      />
      <div className={compoundClassName} onClick={focusInput}>
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        <div className={s.background}>
          <div className={s.shape}>
            <div className={cx(s.item1, s.label2)} />
            <div className={s.item2}>
              {!notFrozen && shouldShowBalanceButtons && (
                <Balance balance={wrapFrozenBalance} text={t('common|Frozen Balance')} colorMode={colorThemeMode} />
              )}
              {shouldShowBalanceButtons ? (
                <Balance
                  balance={wrapAvailableBalance}
                  text={balanceLabel ?? t('common|Total Balance')}
                  colorMode={colorThemeMode}
                />
              ) : (
                <div className={s.item2Line} />
              )}
            </div>
            <input
              autoComplete="off"
              className={cx(s.item3, s.input)}
              onFocus={() => setActive(true)}
              onBlur={() => setActive(false)}
              ref={inputRef}
              value={value}
              placeholder="0.0"
              autoFocus
              {...props}
            />
            <div className={s.dangerContainer}>
              {notWhitelistedMessage && <Danger content={notWhitelistedMessage} />}
              <Button
                onClick={() => setTokensModal(true)}
                theme="quaternary"
                className={s.item4}
                textClassName={s.item4Inner}
              >
                <TokensLogos
                  firstTokenIcon={prepareTokenLogo(token1.metadata?.thumbnailUri)}
                  firstTokenSymbol={getTokenSymbol(token1)}
                  secondTokenIcon={prepareTokenLogo(token2.metadata?.thumbnailUri)}
                  secondTokenSymbol={getTokenSymbol(token2)}
                  loading={isTokensLoading}
                />
                <h6 className={cx(s.token, s.tokensSelect)}>
                  {tokenPair ? (
                    <Fragment>
                      {isTokensLoading ? <DashPlug /> : getTokenSymbol(tokenPair.token1, 5)} {'/'}{' '}
                      {isTokensLoading ? <DashPlug /> : getTokenSymbol(tokenPair.token2, 5)}
                    </Fragment>
                  ) : (
                    'Select LP'
                  )}
                </h6>
                <Shevron />
              </Button>
            </div>
          </div>
        </div>
        <Scaffolding showChild={shouldShowBalanceButtons} className={s.scaffoldingPercentSelector}>
          <PercentSelector value={balance ?? null} handleBalance={handleBalance} />
        </Scaffolding>
        <ComplexError error={error} />
      </div>
    </>
  );
};
