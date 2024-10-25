type Config = {
  collectionHandle: string;
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
  };
  excludedOptions: string[];
  startsAt: string;
};

// example percentage discount
const config: Config = {
  collectionHandle: 'mens-hair',
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
  },
  excludedOptions: [
    'Limited',
    'Johnny Cupcakes',
    "Flamin' Hot",
    'The Nightmare Before Christmas',
  ],
  startsAt: '2024-10-31',
};

// example amount of discount
const configAmount: Config = {
  collectionHandle: 'mens-hair',
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
  },
  excludedOptions: [
    'Limited',
    'Johnny Cupcakes',
    "Flamin' Hot",
    'The Nightmare Before Christmas',
  ],
  startsAt: '2024-10-31',
};

export default config;
