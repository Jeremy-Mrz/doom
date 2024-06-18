import { EncodedOrder } from "@bancor/carbon-sdk";
import { OrderStruct } from "@bancor/carbon-sdk/dist/abis/types/CarbonController";
import { BigNumber } from "@bancor/carbon-sdk/utils";

type ToBigInt<T> = T extends BigNumber ? BigInt : T;
type BigIntRecord<T extends object> = {
  [key in keyof T]: ToBigInt<T[key]>;
}
type ToBigNumber<T> = T extends BigInt ? BigNumber : T;
type BigNumberRecord<T extends object> = {
  [key in keyof T]: ToBigNumber<T[key]>;
}

interface OrdersToConvert {
  order0: OrderStruct;
  order1: OrderStruct;
}

interface ConvertedOrder {
  order0: OrderStruct;
  order1: OrderStruct;
}

function toBigInt<T extends object>(arg: T) {
  const res: Partial<BigIntRecord<T>> = {};
  for (const [key, value] of Object.entries(arg)) {
    if (value instanceof BigNumber) {
      (res as any)[key] = value.toBigInt();
    } else if (typeof value === 'object' && !!value) {
      (res as any)[key] = toBigInt(value);
    } else {
      res[key as keyof T] = value;
    }
  };
  return res;
};

function toBigNumber<T extends object>(arg: T) {
  const res: Partial<BigNumberRecord<T>> = {};
  for (const [key, value] of Object.entries(arg)) {
    if (typeof value === "bigint") {
      (res as any)[key] = BigNumber.from(value);
    } else if (typeof value === 'object' && !!value) {
      (res as any)[key] = toBigNumber(value);
    } else {
      res[key as keyof T] = value;
    }
  };
  return res;
};

export function convertOrders(orders: OrdersToConvert, target: "bigint" | "bignumber") {
  const res: Partial<ConvertedOrder> = {};
  for (const [key, value] of Object.entries(orders)) {
    res[key as keyof ConvertedOrder] = target == "bigint"
      ? toBigInt<OrderStruct>(value) as OrderStruct
      : toBigNumber<OrderStruct>(value) as OrderStruct;
  };
  return res as ConvertedOrder;
}