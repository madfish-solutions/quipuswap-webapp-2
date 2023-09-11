import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import {
  getFirstElement,
  getLastElementFromArray,
  getPenultimateElement,
  getTokenSymbol,
  toArray,
  defined
} from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

import styles from './tokens-logos.module.scss';
import { Iterator } from '../iterator';
import { TokenLogo } from '../token-logo';

type TokensList = Nullable<Token> | Array<Nullable<Token>>;

interface TokensLogosPropsAbstraction {
  tokens: TokensList;
  className?: string;
  imageClassName?: string;
  loading?: boolean;
}

interface FixedTokensLogos {
  layout?: 'fixed';
  width?: number;
}
interface FillTokensLogos {
  layout: 'fill';
}

interface FixedTokensLogosProps extends FixedTokensLogos, TokensLogosPropsAbstraction {}

interface FillTokensLogosProps extends FillTokensLogos, TokensLogosPropsAbstraction {}

type TokensLogosProps = FixedTokensLogosProps | FillTokensLogosProps;

const prepareTokens = (tokens: TokensList, layoutProps: FixedTokensLogos | FillTokensLogos) => {
  return toArray(tokens)
    .filter(Boolean)
    .map(token => ({
      src: defined(token).metadata.thumbnailUri,
      tokenSymbol: getTokenSymbol(defined(token)),
      ...layoutProps
    }));
};

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const MAX_TOKENS_TO_SHOW = 4;

export const TokensLogos: FC<TokensLogosProps> = props => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { tokens, className } = props;

  const layoutBasedProps =
    props.layout === 'fill' ? { layout: 'fill' as const } : { layout: 'fixed' as const, size: props.width };

  const compoundClassName = cx(styles.root, modeClass[colorThemeMode], className);
  const preparedTokens = prepareTokens(tokens, layoutBasedProps);

  return (
    <div className={compoundClassName}>
      {preparedTokens.length > MAX_TOKENS_TO_SHOW ? (
        <div className={styles.container}>
          <TokenLogo {...getFirstElement(preparedTokens)} />
          <div>...</div>
          <TokenLogo {...getPenultimateElement(preparedTokens)} />
          <TokenLogo {...getLastElementFromArray(preparedTokens)} />
        </div>
      ) : (
        <Iterator render={TokenLogo} data={preparedTokens} />
      )}
    </div>
  );
};
