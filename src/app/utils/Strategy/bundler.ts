import { ConvertedStrategy, StrategyBundle } from "../types";

export function bundleStrategies(strategies: ConvertedStrategy[]): StrategyBundle {
  const bundle = [];
  for (const strategy of strategies) {
    const { token0, token1, order0, order1 } = strategy;
    bundle.push({ token0, token1, orders: [order0, order1] });
  };
  return bundle;
}