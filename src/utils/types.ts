import { FoundDex } from '@quipuswap/sdk';
import { BigMapAbstraction } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export type QSMainNet = 'mainnet' | 'granadanet';

type QSNetworkType =
  | 'mainnet'
  | 'granadanet'
  | 'florencenet'
  | 'edo2net'
  | 'edonet'
  | 'delphinet'
  | 'carthagenet';

export interface QSNetwork {
  id: QSNetworkType
  connectType: 'default' | 'custom'
  name: string
  type: 'main' | 'test'
  rpcBaseURL: string
  metadata: string
  description: string
  disabled: boolean
}

export enum WalletType {
  BEACON = 'beacon',
  TEMPLE = 'temple',
}

export interface WhitelistedTokenPair {
  balance?: string,
  frozenBalance?: string,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  dex: FoundDex
}

export interface WhitelistedToken {
  type: 'fa1.2' | 'fa2'
  contractAddress: string
  fa2TokenId?: number
  metadata: WhitelistedTokenMetadata
}

export interface WhitelistedBaker {
  name: string,
  address: string,
  logo: string,
  votes: number,
  fee: number,
  freeSpace: BigNumber
}

export type WhitelistedTokenMetadata = {
  decimals: number
  symbol: string
  name: string
  thumbnailUri: string
};

export type VoterType = {
  vote: string,
  veto: string,
  candidate: string
};

export type TokenDataType = {
  token: {
    address: string,
    type: 'fa1.2' | 'fa2',
    id?: number | null
    decimals: number,
  },
  balance: string,
  exchangeRate?: string
};

export type TokenDataMap = {
  first: TokenDataType,
  second: TokenDataType
};

export type SwapFormValues = {
  lastChange: 'balance1' | 'balance2'
  balance1: BigNumber
  balance2: BigNumber
  recipient: string
  slippage: string
};

export type LiquidityFormValues = {
  switcher: boolean
  balance1: BigNumber
  balance2: BigNumber
  balance3: BigNumber
  balanceA: BigNumber
  balanceB: BigNumber
  balanceTotalA: BigNumber
  balanceTotalB: BigNumber
  lpBalance: BigNumber
  frozenBalance: BigNumber
  lastChange: string
  estimateLP: BigNumber
  slippage: string
};

export type PoolShare = {
  unfrozen:BigNumber,
  frozen:BigNumber,
  total:BigNumber
};

export type WhitelistedFarm = {
  remaining: Date
  tokenPair: WhitelistedTokenPair
  totalValueLocked: string
  apy: string
  daily: string
  balance: string
  deposit: string
  earned: string
  multiplier: string
  tokenContract: string
  farmContract: string
  projectLink: string
  analyticsLink: string
};

export type WhitelistedStake = {
  id: number,
  remaining: Date
  tokenPair: WhitelistedTokenPair
  totalValueLocked: string
  apy: string
  daily: string
  balance: string
  deposit: string
  earned: string
  earn: string
  tokenContract: string
  farmContract: string
  projectLink: string
  analyticsLink: string
};

export type VoteFormValues = {
  balance1: number
  selectedBaker: string
  method:'first' | 'second'
};

export type GovernanceStorageInfo = {
  accuracy: BigNumber,
  expected_sender?: string,
  id_count: BigNumber,
  locked_balances: {
    balances: BigMapAbstraction,
    proposals: BigMapAbstraction
  }
  owner: string
  pending_owner: null
  proposal_config: {
    proposal_stake: BigNumber,
    voting_quorum: BigNumber,
    support_quorum: BigNumber
  }
  proposals: BigMapAbstraction
  temp_proposal_cache?: any
  token_address: string
  token_id: BigNumber,
  votes: BigMapAbstraction
};

export type GovernanceProposalType = {
  creator: string,
  ipfs_link: string,
  forum_link: string,
  votes_for: BigNumber,
  votes_against: BigNumber,
  start_date: string,
  end_date: string,
  status: {
    activated: number,
    approved: number,
    banned: number,
    pending: number,
    rejected: number,
    underrated: number,
    voting: number,
  },
  config: {
    proposal_stake: BigNumber,
    voting_quorum: BigNumber,
    support_quorum: BigNumber,
  },
  collateral: BigNumber
};

export type ProposalType = {
  name: string,
  id: number,
  collateral: BigNumber,
  config: {
    proposalStake: BigNumber,
    votingQuorum: BigNumber,
    supportQuorum: BigNumber,
  },
  creator: string,
  endDate: string,
  forumLink: string,
  ipfsLink: string,
  startDate: string,
  status: ProposalStatus,
  votesAgainst: BigNumber,
  votesFor: BigNumber,
};

export type ProposalStatus = 'activated' |
'approved' |
'banned' |
'pending' |
'rejected' |
'underrated' |
'voting';

export type GovernanceCardProps = {
  name: string
  workDates: Date[]
  status: ProposalStatus
  description: string
  ipfsLink: string
  shortDescription: React.ReactNode
  voted: string
  support: string
  reject: string
  votes: string
  claimable: string
  participants: string
  quorum: string
  currency: string
  id:string
  author:string
  className?: string
  onClick?: () => void
  handleUnselect?: () => void
  href?: string
};

export type PoolTableType = {
  id: number,
  xtzUsdQuote: string,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  pair: {
    name: string,
    token1: {
      icon: string,
      symbol: string,
    },
    token2: {
      icon: string,
      symbol: string,
    },
  },
  data: {
    tvl: number,
    volume24h: number,
  },
  buttons: {
    first: {
      label: string,
      href: string,
      external: boolean,
    },
    second: {
      label: string,
      href: string,
    },
  },
};

export type GovernanceUserInfo = {
  against: BigNumber
} | {
  for: BigNumber
};
