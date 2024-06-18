export default [
  {
    inputs: [
      {
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint128",
            name: "y",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "z",
            type: "uint128",
          },
          {
            internalType: "uint64",
            name: "A",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "B",
            type: "uint64",
          },
        ],
        internalType: "struct CarbonController.Order[2]",
        name: "orders",
        type: "tuple[2]",
      },
    ],
    name: "createStrategy",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "strategy",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address[2]",
            name: "tokens",
            type: "address[2]",
          },
          {
            components: [
              {
                internalType: "uint128",
                name: "y",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "z",
                type: "uint128",
              },
              {
                internalType: "uint64",
                name: "A",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "B",
                type: "uint64",
              },
            ],
            internalType: "struct CarbonController.Order[2]",
            name: "orders",
            type: "tuple[2]",
          },
        ],
        internalType: "struct CarbonController.Strategy",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sourceToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "targetToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "strategyId",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "amount",
            type: "uint128",
          },
        ],
        internalType: "struct CarbonController.TradeAction[]",
        name: "tradeActions",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint128",
        name: "minReturn",
        type: "uint128",
      },
    ],
    name: "tradeBySourceAmount",
    outputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strategyId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint128",
            name: "y",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "z",
            type: "uint128",
          },
          {
            internalType: "uint64",
            name: "A",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "B",
            type: "uint64",
          },
        ],
        internalType: "struct CarbonController.Order[2]",
        name: "currentOrders",
        type: "tuple[2]",
      },
      {
        components: [
          {
            internalType: "uint128",
            name: "y",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "z",
            type: "uint128",
          },
          {
            internalType: "uint64",
            name: "A",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "B",
            type: "uint64",
          },
        ],
        internalType: "struct CarbonController.Order[2]",
        name: "newOrders",
        type: "tuple[2]",
      },
    ],
    name: "updateStrategy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] 