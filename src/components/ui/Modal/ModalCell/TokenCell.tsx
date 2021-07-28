import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { WhitelistedToken } from '@utils/types';
import { TokensLogos } from '@components/ui/TokensLogos';
import { Bage } from '@components/ui/Bage';

import s from './ModalCell.module.sass';

type TokenCellProps = {
  token: WhitelistedToken,
  loading?: boolean
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const TokenCell: React.FC<TokenCellProps> = ({
  token,
  loading = false,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    loading && s.loading,
    s.listItem,
    s.splitRow,
  );

  const loadingLogoClassName = loading ? s.loadingLogos : '';
  const loadingNameClassName = loading ? s.loadingName : '';
  const loadginSymbolClassName = loading ? s.loadingSymbol : '';
  const loadingBageClassName = loading ? s.loadingBage : '';

  return (
    <div className={compoundClassName}>
      <div className={s.joinRow}>
        <TokensLogos
          token1={token}
          className={loadingLogoClassName}
        />
        <div className={s.mleft8}>
          <div className={s.joinRow}>
            <h6 className={loadingNameClassName}>
              {loading ? '' : token.metadata?.symbol ?? token.metadata?.name ?? 'Unnamed'}
            </h6>
            {loading && (
            <Bage
              className={loadingBageClassName}
              text={'   '}
              loading
            />
            )}
            {token?.type ? (token.type.toLowerCase() === 'fa1.2' ? ['FA 1.2'] : ['FA 2.0', `ID: ${token.fa2TokenId}`]).map((x) => (
              <Bage
                className={s.bage}
                key={x}
                text={x}
              />
            )) : ''}
          </div>
          {!loading ? (
            <span className={cx(s.caption)}>
              {token.metadata?.name ?? token.metadata?.symbol ?? token.contractAddress}
            </span>
          ) : <div className={loadginSymbolClassName} />}
        </div>
      </div>
    </div>
  );
};
