import { FC } from 'react';

import cx from 'classnames';

import { Iterator } from '@modules/farming/pages/list/helpers';
import { toArray } from '@shared/helpers';
import { Nullable } from '@shared/types';

import { TokenLogo } from '../token-logo';
import styles from './new-tokens-logo.module.scss';

interface TokenLogoInfo {
  tokenIcon: Nullable<string>;
  tokenSymbol: Nullable<string>;
}

type TokensList = TokenLogoInfo | Array<TokenLogoInfo>;

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

type NewTokensLogosProps = FixedTokensLogosProps | FillTokensLogosProps;

const prepareTokens = (tokens: TokensList, layoutProps: FixedTokensLogos | FillTokensLogos) => {
  return toArray(tokens).map(({ tokenIcon, tokenSymbol }) => ({
    src: tokenIcon,
    tokenSymbol,
    ...layoutProps
  }));
};

export const NewTokensLogos: FC<NewTokensLogosProps> = props => {
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
