import { Toolkit } from '@bancor/carbon-sdk/strategy-management';
import { ChainCache, initSyncedCache } from '@bancor/carbon-sdk/chain-cache';
import { ContractsApi } from '@bancor/carbon-sdk/contracts-api';
import { contractAddresses } from './contract/addresses';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

let api: ContractsApi;
let sdkCache: ChainCache;
let carbonSDK: Toolkit;
export const config = {
  carbonControllerAddress: contractAddresses['ccAddress'],
  voucherAddress: contractAddresses['voucherAddress']
};

export const initSDK = () => {
  if (carbonSDK) return { SDK: carbonSDK };
  const rpcUrl = "http://127.0.0.1:8545/";
  const provider = new StaticJsonRpcProvider({ url: rpcUrl, skipFetchSetup: true }, 1);
  const config = {
    carbonControllerAddress: contractAddresses['ccAddress'],
    voucherAddress: contractAddresses['voucherAddress']
  };
  api = new ContractsApi(provider, config);
  const { cache, startDataSync } = initSyncedCache(api.reader);
  sdkCache = cache;
  carbonSDK = new Toolkit(
    api,
    sdkCache
  );
  return {
    SDK: carbonSDK,
    waitForSync: startDataSync(),
  };
};