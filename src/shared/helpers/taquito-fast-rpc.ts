import { HttpBackend, HttpRequestOptions, HttpRequestFailed, HttpResponseError } from '@taquito/http-utils';
import { RpcClient } from '@taquito/rpc';
import axios from 'axios';

import mem from '../../libs/mem';

const REFRESH_INTERVAL = 20_000; // 20 src
const MEM_MAX_AGE = 180_000; // 3 min

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

enum ResponseType {
  TEXT = 'text',
  JSON = 'json'
}

const DEFAULT_QUERY_TIMEOUT = 30000;

class NoVespaiachHttpBackend extends HttpBackend {
  async createRequest<T>(
    { url, method, timeout = DEFAULT_QUERY_TIMEOUT, query, headers = {}, json = true }: HttpRequestOptions,
    data?: object | string
  ) {
    let resType: ResponseType;
    let transformResponse = axios.defaults.transformResponse;

    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (!json) {
      resType = ResponseType.TEXT;
      transformResponse = [<Type>(v: Type) => v];
    } else {
      resType = ResponseType.JSON;
    }

    try {
      const response = await axios.request<T>({
        url: url + this.serialize(query),
        method: method ?? 'GET',
        headers,
        responseType: resType,
        transformResponse,
        timeout: timeout,
        data
      });

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        let errorData;

        if (typeof err.response.data === 'object') {
          errorData = JSON.stringify(err.response.data);
        } else {
          errorData = err.response.data;
        }

        throw new HttpResponseError(
          `Http error response: (${err.response.status}) ${errorData}`,
          err.response.status,
          err.response.statusText,
          errorData,
          url + this.serialize(query)
        );
      } else {
        throw new HttpRequestFailed(`${method} ${url + this.serialize(query)} ${String(err)}`);
      }
    }
  }
}

/* eslint-disable no-param-reassign */
export class FastRpcClient extends RpcClient {
  refreshInterval = REFRESH_INTERVAL;

  memMaxAge = MEM_MAX_AGE;

  private latestBlock?: {
    hash: string;
    refreshedAt: number; // timestamp
  };

  constructor(url: string, chain?: string, httpBackend?: HttpBackend) {
    super(url, chain, httpBackend ?? new NoVespaiachHttpBackend());
  }

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
