import { OrderStruct } from "@bancor/carbon-sdk/dist/abis/types/CarbonController";
import { BigNumberish } from "ethers";
import { BigNumber } from "@bancor/carbon-sdk/utils";

export interface CreateStrategyParams {
  baseTokenAddress: string;
  quoteTokenAddress: string;
  buyMin: string;
  buyMax: string;
  sellMin: string;
  sellMax: string;
  buyBudget: string;
  sellBudget: string;
}

export interface ConvertedStrategy {
  token0: string;
  token1: string;
  order0: OrderStruct;
  order1: OrderStruct;
}

export interface BundledStrategy {
  token0: string;
  token1: string;
  orders: OrderStruct[];
}

export type StrategyBundle = BundledStrategy[];