import { buildStrategyObject, encodeStrategy } from '@bancor/carbon-sdk/strategy-management';
import { tokens } from '../tokens/info';
import { CreateStrategyParams } from '../types';
import { convertOrders } from '../order/converter';
import { parseUnits } from 'ethers';

export function createStrategy(params: CreateStrategyParams) {
  const { baseTokenAddress, quoteTokenAddress, buyMin, buyMax, sellMin, sellMax, buyBudget, sellBudget } = params;
  const baseToken = tokens.find(token => token.address === baseTokenAddress);
  const quoteToken = tokens.find(token => token.address === quoteTokenAddress);

  if (!baseToken || !quoteToken) throw new Error('Base/quote token not found');

  const strategy = buildStrategyObject(
    baseTokenAddress,
    quoteTokenAddress,
    baseToken.decimals,
    quoteToken.decimals,
    buyMin,
    buyMax,
    buyMax,
    buyBudget,
    sellMin,
    sellMin,
    sellMax,
    sellBudget
  );

  const amount0 = parseUnits(buyBudget, baseToken.decimals);
  const amount1 = parseUnits(sellBudget, quoteToken.decimals);

  const encodedStrategy = encodeStrategy(strategy);
  const { order0, order1, token0, token1 } = encodedStrategy;
  const convertedOrder = convertOrders({ order0, order1 }, 'bigint');
  if (!convertedOrder.order0 || !convertedOrder.order1) throw new Error('Unable to convert order values to BigInt');
  return { token0, token1, amount0, amount1, order0: convertedOrder.order0, order1: convertedOrder.order1 };
}