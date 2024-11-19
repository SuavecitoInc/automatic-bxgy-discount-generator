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
  collectionHandle: 'buy-2-get-1-free',
  timezone: 'America/Los_Angeles',
  discount: {
    title: 'Buy 2 Get 1 Free 2024',
    customerBuys: {
      type: 'ITEMS',
      quantity: '2',
    },
    customerGets: {
      quantity: '1',
      discountType: 'PERCENT',
      percentage: 1, // decimal value
    },
    startsAt: '2024-11-15',
  },
  excludedByOptions: ['3 Pack', '5 Pack', '6 Pack', '32 oz', '64 oz'],
  excludedByMetafield: {
    namespace: 'debut',
    key: 'exclude_variant_online',
    type: 'boolean',
    value: 'true',
  },
  metafields: [
    {
      namespace: 'debut',
      key: 'is_b2g1f',
      type: 'boolean',
      value: 'true',
    },
    {
      namespace: 'debut',
      key: 'enable_b2g1f',
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
      key: 'is_b2g1f',
      type: 'boolean',
      value: 'true',
    },
  ],
};

export default config;
