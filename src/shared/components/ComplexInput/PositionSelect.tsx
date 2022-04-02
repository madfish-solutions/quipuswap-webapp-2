import { Dispatch, FC, HTMLProps, SetStateAction, useContext, useEffect, useRef, useState } from 'react';

import cx from 'classnames';
import { useTranslation } from '@translation';

import { TEZOS_TOKEN } from '@config/config';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { Danger } from '@shared/elements';
import { getMessageNotWhitelistedTokenPair, getTokenSymbol, prepareTokenLogo } from '@shared/helpers';
import { PositionsModal } from '@shared/modals';
import { Shevron } from '@shared/svg';
import { Nullable, Token, TokenPair } from '@shared/types';

import { Button } from '../button';
import { LoadableTokenPairName } from '../loadable-token-pair-name';
import { Scaffolding } from '../scaffolding';
import { Balance } from '../state-components/balance';
import { TokensLogos } from '../tokens-logos';
import { ComplexError } from './ComplexError';
import s from './ComplexInput.module.scss';
import { PercentSelector } from './PercentSelector';

interface PositionSelectProps extends HTMLProps<HTMLInputElement> {
  shouldShowBalanceButtons?: boolean;
  className?: string;
  balance?: Nullable<string>;
  balanceLabel?: string;
  frozenBalance?: string;
  notFrozen?: boolean;
  label: string;
  error?: string;
  notSelectable1?: Token;
  notSelectable2?: Token;
  handleChange?: (tokenPair: TokenPair) => void;
  handleBalance: (value: string) => void;
  tokenPair: Nullable<TokenPair>;
  setTokenPair?: (tokenPair: TokenPair) => void;
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

  const tokenPairFrozen = notSelectable1 && notSelectable2;

  return (
    <>
      <PositionsModal
        isOpen={tokensModal}
        onRequestClose={() => setTokensModal(false)}
        onChange={selectedToken => {
          tokensUpdating?.setIsTokenChanging(true);
          setTokenPair?.(selectedToken);
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
                onClick={() => !tokenPairFrozen && setTokensModal(true)}
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
                  <LoadableTokenPairName
                    tokenPair={tokenPair}
                    isLoading={isTokensLoading}
                    placeholder="Select LP"
                    tokenSymbolSliceAmount={5}
                  />
                </h6>
                {!tokenPairFrozen && <Shevron />}
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
