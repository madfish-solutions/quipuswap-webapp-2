import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
};

/** Candle plot point data. */
export type CandlePlotPoint = {
  __typename?: 'CandlePlotPoint';
  /** Timestamp (x-axis). */
  time: Scalars['Int'];
  /** Open value (y-axis). */
  open: Scalars['Float'];
  /** Close value (y-axis). */
  close: Scalars['Float'];
  /** High value (y-axis) - not used properly. */
  high: Scalars['Float'];
  /** Low value (y-axis) - not used properly. */
  low: Scalars['Float'];
  /** Historical price TEZ(XTZ) to $(USD). */
  xtzUsdQuoteHistorical: Scalars['String'];
};

/** Percent changes by periods. */
export type Change = {
  __typename?: 'Change';
  /** Percent change by day. */
  day: Scalars['String'];
  /** Percent change by week. */
  week: Scalars['String'];
  /** Percent change by month. */
  month: Scalars['String'];
};

/** Currency Enum. */
export enum CurrencyEnum {
  Usd = 'USD',
  Xtz = 'XTZ'
}


/** Overview data for main page of Analytics. */
export type Overview = {
  __typename?: 'Overview';
  /** Actual price TEZ(XTZ) to $(USD). */
  xtzUsdQuote: Scalars['String'];
  /**
   * Liquidity of `all pairs` on Quipuswap.
   *
   * Liquidity = `TEZ` + `token` pool.
   *
   * Count in muTEZ.
   */
  totalLiquidity?: Maybe<Scalars['String']>;
  /**
   * Volume for last 24-hour period of `all pairs` on Quipuswap.
   *
   * Volume = `tezToTokenPayment` + `tokenToTezPayment` txs amounts of TEZ.
   *
   * Count in muTEZ.
   */
  volume24h?: Maybe<Scalars['String']>;
  /** Transactions count for last 24-hour period of `all pairs` on Quipuswap. */
  trasactionsCount24h: Scalars['Int'];
  /** Percent changes of `TEZ(XTZ) to $(USD) price` by periods. */
  xtzUsdQuoteChange: Change;
  /** Percent changes of `liquidity` by periods. */
  totalLiquidityChange: Change;
  /** Percent changes of `volume` by periods. */
  volumeChange: Change;
  /** Plot data for `liquidity`. */
  plotLiquidity: Array<Maybe<PlotPoint>>;
  /** Plot data for `volume`. */
  plotVolume: Array<Maybe<PlotPoint>>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

/** Pair (DEX) object from Quipuswap. */
export type Pair = {
  __typename?: 'Pair';
  CreatorId?: Maybe<Scalars['Int']>;
  /** Pair (DEX) address. */
  id?: Maybe<Scalars['String']>;
  /** Version of DEX contract. */
  version: Scalars['String'];
  /** Token data of first token in pair. */
  token1: Token;
  /** Token data of second token in pair. */
  token2: Token;
  /** First token amount in pool in lowest chunks (muTEZ for TEZ). */
  token1Pool: Scalars['String'];
  /** Second token amount in pool in lowest chunks (muTEZ for TEZ). */
  token2Pool: Scalars['String'];
  /**
   * Volume for last 24-hour period of `pair` on Quipuswap.
   *
   * Volume = `tezToTokenPayment` + `tokenToTezPayment` txs amounts of TEZ.
   *
   * Count in muTEZ.
   */
  volume24h: Scalars['Float'];
  /**
   * Volume for last 7-day period of `pair` on Quipuswap.
   *
   * Volume = `tezToTokenPayment` + `tokenToTezPayment` txs amounts of TEZ.
   *
   * Count in muTEZ.
   */
  volume7d: Scalars['Float'];
  /**
   * Liquidity of `pair` on Quipuswap.
   *
   * Liquidity = `TEZ` + `token` pool.
   *
   * Count in muTEZ.
   */
  liquidity: Scalars['Float'];
  /** Percent changes of `liquidity` by periods. */
  liquidityChange: Change;
  /** Percent changes of `volume` by periods. */
  volumeChange: Change;
  /** Percent changes of `fee` by periods. */
  feeChange: Change;
  /** Transactions count for last 24-hour period of `pair` on Quipuswap. */
  transactionsCount24h: Scalars['Int'];
  /** Plot data for `liquidity`. */
  plotLiquidity: Array<Maybe<PlotPoint>>;
  /** Plot data for `volume`. */
  plotVolume: Array<Maybe<PlotPoint>>;
};

/** Types Enum of transactions of interaction with DEX - invest/divest liquidity, swaps. */
export enum PairActionType {
  Add = 'Add',
  Remove = 'Remove',
  Swap1to2 = 'Swap1to2',
  Swap2to1 = 'Swap2to1',
  All = 'All'
}

export type PairConnection = {
  __typename?: 'PairConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PairEdge>>;
  /** Total count of entries in list. */
  totalCount?: Maybe<Scalars['Int']>;
};

/** A Relay edge containing a `Pair` and its cursor. */
export type PairEdge = {
  __typename?: 'PairEdge';
  /** The item at the end of the edge */
  node?: Maybe<Pair>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** Transactions of interaction with DEX - invest/divest liquidity, swaps. */
export type PairTransaction = {
  __typename?: 'PairTransaction';
  /** OpHash of transaction. */
  id: Scalars['String'];
  /** Timestamp when transaction was executed. */
  timestamp: Scalars['DateTime'];
  /**
   * Type of transaction.
   * Allowed values: `Add` (investLiquidity),
   *                 `Remove` (divestLiquidity),
   *                 `Swap1to2` (tezToTokenPayment),
   *                 `Swap2to1` (tokenToTezPayment),
   *                 `All` (all of types).
   */
  trxType: PairActionType;
  /** Pair that bound to that operation. */
  pair: SimplePair;
  /** Historical price TEZ(XTZ) to $(USD). */
  xtzUsdQuoteHistorical: Scalars['String'];
  /** Amount of tokens of `Token1` in lowest chunks (muTEZ for TEZ). */
  token1Amount: Scalars['String'];
  /** Amount of tokens of `Token2` in lowest chunks (muTEZ for TEZ). */
  token2Amount: Scalars['String'];
  /** Sender address that initiated that operation. */
  sender: Scalars['String'];
};

export type PairTransactionConnection = {
  __typename?: 'PairTransactionConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PairTransactionEdge>>;
  /** Total count of entries in list. */
  totalCount?: Maybe<Scalars['Int']>;
};

/** A Relay edge containing a `PairTransaction` and its cursor. */
export type PairTransactionEdge = {
  __typename?: 'PairTransactionEdge';
  /** The item at the end of the edge */
  node?: Maybe<PairTransaction>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

/** Plot point data. */
export type PlotPoint = {
  __typename?: 'PlotPoint';
  /** Timestamp (x-axis). */
  time: Scalars['Int'];
  /** Value (y-axis). */
  value: Scalars['Float'];
  /** Historical price TEZ(XTZ) to $(USD). */
  xtzUsdQuoteHistorical: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Overview data for main page of Analytics. */
  overview: Overview;
  /**
   * `Token` data.
   *
   * IMPORTANT: Token should have at least one pair on Quipuswap!
   */
  token: Token;
  /** `Tokens` data list. */
  tokens?: Maybe<TokenConnection>;
  /** `Pair` (DEX) data. */
  pair: Pair;
  /** Quipuswap `pairs` (DEXes) data list. */
  pairs?: Maybe<PairConnection>;
  /** Transactions of interaction with DEX - `invest`/`divest` liquidity, `swaps`. */
  transactions?: Maybe<PairTransactionConnection>;
  /** Search by address of token or pair. */
  search: SearchResult;
};


export type QueryTokenArgs = {
  id: Scalars['String'];
  tokenId?: Maybe<Scalars['String']>;
};


export type QueryTokensArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  addressList?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryPairArgs = {
  id: Scalars['String'];
};


export type QueryPairsArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  addressList?: Maybe<Array<Maybe<Scalars['String']>>>;
  tokenAddress?: Maybe<Scalars['String']>;
  tokenId?: Maybe<Scalars['String']>;
};


export type QueryTransactionsArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  scope: ScopeType;
  address?: Maybe<Scalars['String']>;
  trxType?: Maybe<PairActionType>;
  tokenId?: Maybe<Scalars['String']>;
};


export type QuerySearchArgs = {
  address: Scalars['String'];
};

/**
 * Scope of transactions.
 *
 * Allowed values: `Overview`, `Token`, `Pair`, `Account`.
 */
export enum ScopeType {
  Overview = 'Overview',
  Token = 'Token',
  Pair = 'Pair',
  Account = 'Account'
}

/** Search result. */
export type SearchResult = {
  __typename?: 'SearchResult';
  /** List of `minimal tokens` data. */
  tokens?: Maybe<Array<Maybe<SimpleToken>>>;
  /** List of `minimal pairs` (DEXes) data. */
  pairs?: Maybe<Array<Maybe<SimplePair>>>;
};

/** Minimal pair (DEX) object from Quipuswap. */
export type SimplePair = {
  __typename?: 'SimplePair';
  /** Pair (DEX) address. */
  id?: Maybe<Scalars['String']>;
  /** Version of DEX contract. */
  version: Scalars['String'];
  /** Minimal token data of first token in pair. */
  token1: SimpleToken;
  /** Minimal token data of second token in pair. */
  token2: SimpleToken;
};

/** Minimal token object. */
export type SimpleToken = {
  __typename?: 'SimpleToken';
  /** `Token address`. */
  id?: Maybe<Scalars['String']>;
  /** `Token ID` for `FA2` tokens. */
  tokenId?: Maybe<Scalars['String']>;
  /** Token name from metadata. */
  name?: Maybe<Scalars['String']>;
  /** Token symbol from metadata. */
  symbol?: Maybe<Scalars['String']>;
  /** Token decimals from metadata. */
  decimals?: Maybe<Scalars['String']>;
  /** Token icon from metadata. */
  icon?: Maybe<Scalars['String']>;
};

/** Token Standard Enum. */
export enum Standard {
  Null = 'Null',
  Fa12 = 'FA12',
  Fa2 = 'FA2'
}

/** Token object. */
export type Token = {
  __typename?: 'Token';
  CreatorId?: Maybe<Scalars['Int']>;
  /** `Token address`. */
  id?: Maybe<Scalars['String']>;
  /** `Token ID` for `FA2` tokens. */
  tokenId?: Maybe<Scalars['String']>;
  /** Token name from metadata. */
  name?: Maybe<Scalars['String']>;
  /** Token symbol from metadata. */
  symbol?: Maybe<Scalars['String']>;
  /** Token decimals from metadata. */
  decimals?: Maybe<Scalars['String']>;
  /** Token icon from metadata. */
  icon?: Maybe<Scalars['String']>;
  /** Token standard (FA12/FA2/Null(for Tezos)) */
  standard: Standard;
  /**
   * Volume for last 24-hour period of `Token` on Quipuswap.
   *
   * Volume = `tezToTokenPayment` + `tokenToTezPayment` txs amounts of TEZ.
   *
   * Count in muTEZ.
   */
  volume24h: Scalars['String'];
  /**
   * `Token` price.
   * Price count from `pair` (DEX) with greatest `liquidity`.
   * Count in TEZ.
   */
  price: Scalars['String'];
  /**
   * Liquidity of `Token` on Quipuswap.
   *
   * Liquidity = `TEZ` + `token` pool.
   *
   * Count in muTEZ.
   */
  liquidity: Scalars['String'];
  /** Transactions count for last 24-hour period of `Token` on Quipuswap. */
  transactionsCount24h: Scalars['Int'];
  /** Percent changes of `TEZ(XTZ) or $(USD) price of  `Token`` by periods. */
  priceChange: Change;
  /** Percent changes of `liquidity` by periods. */
  liquidityChange: Change;
  /** Percent changes of `volume` by periods. */
  volumeChange: Change;
  /** Plot data for `price`. */
  plotPrice: Array<Maybe<CandlePlotPoint>>;
  /** Plot data for `liquidity`. */
  plotLiquidity: Array<Maybe<PlotPoint>>;
  /** Plot data for `volume`. */
  plotVolume: Array<Maybe<PlotPoint>>;
};


/** Token object. */
export type TokenPriceChangeArgs = {
  currency?: Maybe<CurrencyEnum>;
};

export type TokenConnection = {
  __typename?: 'TokenConnection';
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<TokenEdge>>;
  /** Total count of entries in list. */
  totalCount?: Maybe<Scalars['Int']>;
};

/** A Relay edge containing a `Token` and its cursor. */
export type TokenEdge = {
  __typename?: 'TokenEdge';
  /** The item at the end of the edge */
  node?: Maybe<Token>;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type GetPairPlotLiquidityQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetPairPlotLiquidityQuery = (
  { __typename?: 'Query' }
  & { pair: (
    { __typename?: 'Pair' }
    & { plotLiquidity: Array<Maybe<(
      { __typename?: 'PlotPoint' }
      & Pick<PlotPoint, 'time' | 'value' | 'xtzUsdQuoteHistorical'>
    )>> }
  ) }
);


export const GetPairPlotLiquidityDocument = gql`
    query GetPairPlotLiquidity($id: String!) {
  pair(id: $id) {
    plotLiquidity {
      time
      value
      xtzUsdQuoteHistorical
    }
  }
}
    `;

/**
 * __useGetPairPlotLiquidityQuery__
 *
 * To run a query within a React component, call `useGetPairPlotLiquidityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPairPlotLiquidityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPairPlotLiquidityQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPairPlotLiquidityQuery(baseOptions: Apollo.QueryHookOptions<GetPairPlotLiquidityQuery, GetPairPlotLiquidityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPairPlotLiquidityQuery, GetPairPlotLiquidityQueryVariables>(GetPairPlotLiquidityDocument, options);
      }
export function useGetPairPlotLiquidityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPairPlotLiquidityQuery, GetPairPlotLiquidityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPairPlotLiquidityQuery, GetPairPlotLiquidityQueryVariables>(GetPairPlotLiquidityDocument, options);
        }
export type GetPairPlotLiquidityQueryHookResult = ReturnType<typeof useGetPairPlotLiquidityQuery>;
export type GetPairPlotLiquidityLazyQueryHookResult = ReturnType<typeof useGetPairPlotLiquidityLazyQuery>;
export type GetPairPlotLiquidityQueryResult = Apollo.QueryResult<GetPairPlotLiquidityQuery, GetPairPlotLiquidityQueryVariables>;