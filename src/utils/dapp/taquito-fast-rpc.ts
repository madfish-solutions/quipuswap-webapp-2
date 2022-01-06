import { RpcClient } from '@taquito/rpc';
import mem from 'mem';

interface RPCOptions {
  block: string;
}

function wantsHead(opts?: RPCOptions) {
  return !opts?.block || opts.block === 'head';
}

function toOptsKey(opts?: RPCOptions) {
  return opts?.block ?? 'head';
}

function onlyOncePerExec<T>(factory: () => Promise<T>) {
  let worker: Promise<T> | null = null;

  return async () => {
    if (!worker) {
      worker = factory().finally(() => {
        worker = null;
      });
    }

    return worker;
  };
}

/* eslint-disable no-param-reassign */
export class FastRpcClient extends RpcClient {
  refreshInterval = 20_000; // 20 src

  memMaxAge = 180_000; // 3 min

  private latestBlock?: {
    hash: string;
    refreshedAt: number; // timestamp
  };

  async getBlockHash(opts?: RPCOptions) {
    await this.loadLatestBlock(opts);

    if (wantsHead(opts) && this.latestBlock) {
      return this.latestBlock.hash;
    }

    return super.getBlockHash(opts);
  }

  async getBalance(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBalanceMemo(address, opts);
  }

  getBalanceMemo = mem(super.getBalance.bind(this), {
    cacheKey: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getLiveBlocks(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getLiveBlocksMemo(opts);
  }

  getLiveBlocksMemo = mem(super.getLiveBlocks.bind(this), {
    cacheKey: ([opts]) => toOptsKey(opts),
    maxAge: this.memMaxAge
  });

  async getStorage(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getStorageMemo(address, opts);
  }

  getStorageMemo = mem(super.getStorage.bind(this), {
    cacheKey: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getScript(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getScriptMemo(address, opts);
  }

  getScriptMemo = mem(super.getScript.bind(this), {
    cacheKey: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getContract(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getContractMemo(address, opts);
  }

  getContractMemo = mem(super.getContract.bind(this), {
    cacheKey: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getEntrypoints(contract: string, opts?: RPCOptions) {
    const normalizer = `${this.getRpcUrl()}_${contract}`;
    try {
      const cached = localStorage.getItem(normalizer);
      if (cached) {
        return JSON.parse(cached);
      }
      // eslint-disable-next-line no-empty
    } catch (_err) {}

    opts = await this.loadLatestBlock(opts);
    const result = await this.getEntrypointsMemo(contract, opts);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(normalizer, JSON.stringify(result));
    }

    return result;
  }

  getEntrypointsMemo = mem(super.getEntrypoints.bind(this), {
    cacheKey: ([contract, opts]) => [contract, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getManagerKey(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getManagerKeyMemo(address, opts);
  }

  getManagerKeyMemo = mem(super.getManagerKey.bind(this), {
    cacheKey: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getDelegate(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getDelegateMemo(address, opts);
  }

  getDelegateMemo = mem(super.getDelegate.bind(this), {
    cacheKey: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getBigMapExpr(id: string, expr: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBigMapExprMemo(id, expr, opts);
  }

  getBigMapExprMemo = mem(super.getBigMapExpr.bind(this), {
    cacheKey: ([id, expr, opts]) => [id, expr, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getDelegates(address: string, opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getDelegatesMemo(address, opts);
  }

  getDelegatesMemo = mem(super.getDelegates.bind(this), {
    cacheKey: ([address, opts]) => [address, toOptsKey(opts)].join(''),
    maxAge: this.memMaxAge
  });

  async getConstants(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getConstantsMemo(opts);
  }

  getConstantsMemo = mem(super.getConstants.bind(this), {
    cacheKey: ([opts]) => toOptsKey(opts),
    maxAge: this.memMaxAge
  });

  async getBlock(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBlockMemo(opts);
  }

  getBlockMemo = mem(super.getBlock.bind(this), {
    cacheKey: ([opts]) => toOptsKey(opts),
    maxAge: this.memMaxAge
  });

  async getBlockHeader(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBlockHeaderMemo(opts);
  }

  getBlockHeaderMemo = mem(super.getBlockHeader.bind(this), {
    cacheKey: ([opts]) => toOptsKey(opts),
    maxAge: this.memMaxAge
  });

  async getBlockMetadata(opts?: RPCOptions) {
    opts = await this.loadLatestBlock(opts);

    return this.getBlockMetadataMemo(opts);
  }

  getBlockMetadataMemo = mem(super.getBlockMetadata.bind(this), {
    cacheKey: ([opts]) => toOptsKey(opts),
    maxAge: this.memMaxAge
  });

  getChainId = mem(super.getChainId.bind(this));

  private async loadLatestBlock(opts?: RPCOptions) {
    const head = wantsHead(opts);
    if (!head) {
      return opts;
    }

    await this.refreshLatestBlock();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { block: this.latestBlock!.hash };
  }

  private refreshLatestBlock = onlyOncePerExec(async () => {
    if (!this.latestBlock || Date.now() - this.latestBlock.refreshedAt > this.refreshInterval) {
      const hash = await super.getBlockHash();
      this.latestBlock = { hash, refreshedAt: Date.now() };
    }
  });
}
