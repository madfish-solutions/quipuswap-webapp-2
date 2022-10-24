export class BackendYouvesFarmingApi {
  static async getYouvesFarmingItem(farmAddress: string) {
    // TODO: fetch data from real backend
    return {
      item: {
        address: farmAddress,
        apr: '365',
        depositExchangeRate: '3',
        depositTokenUrl: 'https://ghostnet.tzkt.io/KT1GPJDTf8GZspCcanaG2KhMvGu3NJRqurat',
        discFactor: '1000000000000000000',
        earnExchangeRate: '1.5',
        vestingPeriodSeconds: '7776000',
        stakeUrl: `https://ghostnet.tzkt.io/${farmAddress}`,
        stakedToken: {
          type: 'FA2',
          isWhitelisted: true,
          metadata: {
            decimals: 6,
            symbol: 'QPT',
            name: 'Quipuswap Pool Token',
            thumbnailUri: 'https://quipuswap.com/QPLP.png'
          },
          contractAddress: 'KT1GPJDTf8GZspCcanaG2KhMvGu3NJRqurat',
          fa2TokenId: 0
        },
        tokens: [
          {
            type: 'FA12',
            contractAddress: 'KT1GG8Zd5rUp1XV8nMPRBY2tSyVn6NR5F4Q1',
            metadata: {
              decimals: 18,
              symbol: 'KUSD',
              name: 'Kolibri',
              thumbnailUri: 'https://kolibri-data.s3.amazonaws.com/logo.png'
            }
          },
          {
            type: 'FA12',
            contractAddress: 'tez',
            metadata: {
              decimals: 6,
              name: 'Tezos',
              symbol: 'TEZ',
              thumbnailUri: 'https://cloudflare-ipfs.com/ipfs/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222'
            }
          }
        ],
        rewardToken: {
          type: 'FA2',
          contractAddress: 'KT19363aZDTjeRyoDkSLZhCk62pS4xfvxo6c',
          fa2TokenId: 0,
          isWhitelisted: true,
          metadata: {
            decimals: 6,
            symbol: 'QUIPU',
            name: 'Quipuswap Governance Token',
            thumbnailUri: 'https://quipuswap.com/tokens/quipu.png'
          }
        },
        staked: '102000000',
        tvlInUsd: '300',
        tvlInStakedToken: '100',
        dailyDistribution: '15',
        dailyDistributionDollarEquivalent: '22.5'
      },
      blockInfo: {
        level: 1350486,
        hash: 'BLEDsaArLU5Zi3Gc4ZQsV8vbBGr9iAwt7zFJcuNxLtFG8KF4Dkb',
        timestamp: '2022-10-17T16:07:40Z'
      }
    };
  }
}
