import fetch from 'isomorphic-fetch';
import dotenv from 'dotenv';
import moment from 'moment-timezone';

import config from '../../config.js';
import { ADMIN_API_ENDPOINT, SHOPIFY_ADMIN_API_TOKEN } from './const.js';
import type { DiscountTypeItems, DiscountTypeAmount } from './types/input.js';

dotenv.config();

type JsonResponse<T> = {
  data: T;
  error?: any;
};

export async function shopifyAdmin<T>(
  query: string,
  variables?: object,
): Promise<JsonResponse<T>> {
  try {
    const response = await fetch(ADMIN_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    return json as JsonResponse<T>;
  } catch (error: any) {
    console.log(error);
  }
}

export function getDate() {
  return moment(config.startsAt).tz('America/Los_Angeles').toISOString();
}

function discountItemsInput(variants: string[]) {
  const input: DiscountTypeItems = {
    automaticBxgyDiscount: {
      combinesWith: {
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: true,
      },
      customerBuys: {
        items: {
          all: false,
          products: {
            productVariantsToAdd: variants,
          },
        },
        value: {
          quantity: config.discount.customerBuys.quantity,
        },
      },
      customerGets: {
        items: {
          all: false,
          products: {
            productVariantsToAdd: variants,
          },
        },
        value: {
          discountOnQuantity: {
            effect: {
              percentage: config.discount.customerGets.percentage,
            },
            quantity: config.discount.customerGets.quantity,
          },
        },
      },
      title: config.discount.title,
      startsAt: getDate(),
    },
  };

  return input;
}

function discountAmountInput(variants: string[]) {
  const input: DiscountTypeAmount = {
    automaticBxgyDiscount: {
      combinesWith: {
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: true,
      },
      customerBuys: {
        items: {
          all: false,
          products: {
            productVariantsToAdd: variants,
          },
        },
        value: {
          amount: config.discount.customerBuys.amount,
        },
      },
      customerGets: {
        items: {
          all: false,
          products: {
            productVariantsToAdd: variants,
          },
        },
        value: {
          discountOnQuantity: {
            effect: {
              amount: config.discount.customerGets.amount,
            },
            quantity: config.discount.customerGets.quantity,
          },
        },
      },
      title: config.discount.title,
      startsAt: getDate(),
    },
  };

  return input;
}

export function createDiscountInput(variants: string[]) {
  const customerBuysType = config.discount.customerBuys.type;
  const discountedValueType = config.discount.customerGets.discountType;

  if (customerBuysType === 'ITEMS' && discountedValueType === 'PERCENT') {
    return discountItemsInput(variants);
  }

  return discountAmountInput(variants);
}

export function verifyConfig() {
  const customerBuysType = config.discount.customerBuys.type;
  const discountedValueType = config.discount.customerGets.discountType;

  const errors: string[] = [];
  if (
    customerBuysType === 'ITEMS' &&
    config.discount.customerBuys.quantity &&
    parseInt(config.discount.customerBuys.quantity) <= 0
  ) {
    errors.push('Customer buys quantity must be greater than 0');
  }

  if (
    customerBuysType === 'ITEMS' &&
    config.discount.customerGets.quantity &&
    parseInt(config.discount.customerGets.quantity) <= 0
  ) {
    errors.push('Customer gets quantity must be greater than 0');
  }

  if (
    customerBuysType === 'AMOUNT' &&
    config.discount.customerBuys.amount &&
    parseFloat(config.discount.customerBuys.amount) <= 0
  ) {
    errors.push('Customer buys amount must be greater than 0.00');
  }

  if (
    customerBuysType === 'AMOUNT' &&
    config.discount.customerGets.amount &&
    parseFloat(config.discount.customerGets.amount) <= 0
  ) {
    errors.push('Customer gets amount must be greater than 0.00');
  }

  if (
    discountedValueType === 'PERCENT' &&
    !config.discount.customerGets.percentage
  ) {
    errors.push('Customer gets percentage is required');
  }

  if (
    discountedValueType === 'PERCENT' &&
    config.discount.customerGets.percentage &&
    config.discount.customerGets.percentage <= 0
  ) {
    errors.push(
      'Customer gets percentage must be greater than 0 and less than 1',
    );
  }

  if (!config.discount.title) {
    errors.push('Discount Title is required');
  }

  if (!config.excludedOptions) {
    errors.push('Excluded options is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}