type Config = {
  collectionHandle: string;
  timezone: string;
  discount: {
    title: string;
    customerBuys: {
      type: 'AMOUNT' | 'ITEMS';
      quantity?: string;
      amount?: string;
    };
    customerGets: {
      quantity: string;
      discountType: 'AMOUNT' | 'PERCENT';
      percentage?: number;
      amount?: string;
    };
    startsAt: string;
  };
  excludedByOptions: string[];
  excludedByMetafield: {
    namespace: string;
    key: string;
    type: string;
    value: string;
  } | null;
  metafields:
    | {
        namespace: string;
        key: string;
        type: string;
        value: string;
      }[]
    | null;
};

// example percentage discount
const config: Config = {
  collectionHandle: 'mens-hair',
  timezone: 'America/Los_Angeles',
  discount: {
    title: 'Test Buy 2 Get 1 Free',
    customerBuys: {
      type: 'ITEMS',
      quantity: '2',
    },
    customerGets: {
      quantity: '1',
      discountType: 'PERCENT',
      percentage: 1,
    },
    startsAt: '2024-10-31',
  },
  excludedByOptions: [
    'Limited',
    'Johnny Cupcakes',
    "Flamin' Hot",
    'The Nightmare Before Christmas',
  ],
  excludedByMetafield: {
    namespace: 'suavecito_function',
    key: 'exclude_from_all_discounts',
    type: 'boolean',
    value: 'true',
  },
  metafields: [
    {
      namespace: 'debut',
      key: 'is_bogo',
      type: 'boolean',
      value: 'true',
    },
  ],
};

// example amount of discount
const configAmount: Config = {
  collectionHandle: 'mens-hair',
  timezone: 'America/Los_Angeles',
  discount: {
    title: 'Test Amount Discount',
    customerBuys: {
      type: 'AMOUNT',
      amount: '99.99',
    },
    customerGets: {
      quantity: '1',
      discountType: 'AMOUNT',
      amount: '33.33',
    },
    startsAt: '2024-10-31',
  },
  excludedByOptions: [
    'Limited',
    'Johnny Cupcakes',
    "Flamin' Hot",
    'The Nightmare Before Christmas',
  ],
  excludedByMetafield: {
    namespace: 'suavecito_function',
    key: 'exclude_from_all_discounts',
    type: 'boolean',
    value: 'true',
  },
  metafields: [
    {
      namespace: 'debut',
      key: 'is_bogo',
      type: 'boolean',
      value: 'true',
    },
  ],
};

export default config;
