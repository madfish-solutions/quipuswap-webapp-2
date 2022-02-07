export class InvalidFa2TokenIdError extends Error {
  constructor(address: string, tokenId: number) {
    super(`Token contract ${address} exists but token with id ${tokenId} doesn't exist`);
  }
}

export class TokenMetadataError extends Error {
  constructor() {
    super('Failed to fetch token metadata');
  }
}
