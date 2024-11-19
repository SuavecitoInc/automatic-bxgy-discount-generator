export type DiscountTypeItems = {
  automaticBxgyDiscount: {
    combinesWith: {
      orderDiscounts: boolean;
      productDiscounts: boolean;
      shippingDiscounts: boolean;
    };
    customerBuys: {
      items: {
        all: boolean;
        products: {
          productVariantsToAdd: string[];
          productsToAdd: string[];
        };
      };
      value: {
        quantity: string;
      };
    };
    customerGets: {
      items: {
        all: boolean;
        products: {
          productVariantsToAdd: string[];
          productsToAdd: string[];
        };
      };
      value: {
        discountOnQuantity: {
          effect: {
            percentage: number;
          };
          quantity: string;
        };
      };
    };
    title: string;
    startsAt: string;
  };
};

export type DiscountTypeAmount = {
  automaticBxgyDiscount: {
    combinesWith: {
      orderDiscounts: boolean;
      productDiscounts: boolean;
      shippingDiscounts: boolean;
    };
    customerBuys: {
      items: {
        all: boolean;
        products: {
          productVariantsToAdd: string[];
          productsToAdd: string[];
        };
      };
      value: {
        amount: string;
      };
    };
    customerGets: {
      items: {
        all: boolean;
        products: {
          productVariantsToAdd: string[];
          productsToAdd: string[];
        };
      };
      value: {
        discountOnQuantity: {
          effect: {
            amount: string;
          };
          quantity: string;
        };
      };
    };
    title: string;
    startsAt: string;
  };
};
