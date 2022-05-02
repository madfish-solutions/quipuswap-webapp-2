import { FC } from 'react';

import cx from 'classnames';

import { getTokenSymbol, toArray } from '@shared/helpers';
import { Token } from '@shared/types';

import { Iterator } from '../iterator';
import { TokenLogo } from '../token-logo';
import styles from './tokens-logos.module.scss';

type TokensList = Token | Array<Token>;

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
  return toArray(tokens).map(token => ({
    src: token.metadata.thumbnailUri,
    tokenSymbol: getTokenSymbol(token),
    ...layoutProps
  }));
};

export const TokensLogos: FC<TokensLogosProps> = props => {
  const { tokens, className } = props;

  const layoutBasedProps =
    props.layout === 'fill' ? { layout: 'fill' as const } : { layout: 'fixed' as const, size: props.width };

  const compoundClassName = cx(styles.root, className);
  const preparedTokens = prepareTokens(tokens, layoutBasedProps);

  return (
    <div className={compoundClassName}>
      <Iterator render={TokenLogo} data={preparedTokens} />
    </div>
  );
};
