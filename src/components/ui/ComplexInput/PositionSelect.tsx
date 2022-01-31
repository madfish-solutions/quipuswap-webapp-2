import React, {
  useRef,
  useState,
  useContext,
  HTMLProps,
  FC,
  Fragment,
  useEffect,
  SetStateAction,
  Dispatch
} from 'react';

import { Shevron, ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { TEZOS_TOKEN } from '@app.config';
import { TokensLogos } from '@components/common/TokensLogos';
import { PositionsModal } from '@components/modals/PositionsModal';
import { Scaffolding } from '@components/scaffolding';
import { ComplexError } from '@components/ui/ComplexInput/ComplexError';
import { PercentSelector } from '@components/ui/ComplexInput/PercentSelector';
import { getWhitelistedTokenSymbol, prepareTokenLogo } from '@utils/helpers';
import { Nullable, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

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
  notSelectable1?: WhitelistedToken;
  notSelectable2?: WhitelistedToken;
  handleChange?: (tokenPair: WhitelistedTokenPair) => void;
  handleBalance: (value: string) => void;
  tokenPair: Nullable<WhitelistedTokenPair>;
  setTokenPair: (tokenPair: WhitelistedTokenPair) => void;
  tokensUpdating?: {
    isTokenChanging: boolean;
    setIsTokenChanging: Dispatch<SetStateAction<boolean>>;
  };
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
  ...props
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
                <Balance balance={frozenBalance} text={t('common|Frozen Balance')} colorMode={colorThemeMode} />
              )}
              {shouldShowBalanceButtons ? (
                <Balance
                  balance={balance}
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
            <Button
              onClick={() => setTokensModal(true)}
              theme="quaternary"
              className={s.item4}
              textClassName={s.item4Inner}
            >
              <TokensLogos
                firstTokenIcon={prepareTokenLogo(token1.metadata?.thumbnailUri)}
                firstTokenSymbol={getWhitelistedTokenSymbol(token1)}
                secondTokenIcon={prepareTokenLogo(token2.metadata?.thumbnailUri)}
                secondTokenSymbol={getWhitelistedTokenSymbol(token2)}
                loading={isTokensLoading}
              />
              <h6 className={cx(s.token, s.tokensSelect)}>
                {tokenPair ? (
                  <Fragment>
                    {isTokensLoading ? <DashPlug /> : getWhitelistedTokenSymbol(tokenPair.token1, 5)} {'/'}{' '}
                    {isTokensLoading ? <DashPlug /> : getWhitelistedTokenSymbol(tokenPair.token2, 5)}
                  </Fragment>
                ) : (
                  'Select LP'
                )}
              </h6>
              <Shevron />
            </Button>
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
