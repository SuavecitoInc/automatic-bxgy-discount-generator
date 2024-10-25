# Suavecito Discount Generator

> The BXGY Discount Generator automates the creation of Automatic Buy X Get Y discounts in Shopify. The discount will be created based on settings defined in the config.

### Setup

Required Shopify Admin Scopes for Access Token:

- write_product_listings
- write_products
- write_discounts

.env

```bash
SHOPIFY_DOMAIN=
SHOPIFY_ADMIN_API_VERSION=2024-07
SHOPIFY_ADMIN_API_TOKEN=
```

Configuration:

> Please update `.config.ts`

```typescript
const config: Config = {
  discount: {
    title: 'Test Buy 2 Get 1 Free',
    customerBuys: {
      type: 'ITEMS', // 'AMOUNT' | 'ITEMS'
      quantity: '2',
    },
    customerGets: {
      quantity: '1',
      discountType: 'PERCENT', // 'AMOUNT' | 'PERCENT'
      percentage: 1, // 0.1 - 1
    },
  },
  excludedOptions: ['Limited', 'Special Edition'],
};
```

Run:

```bash
npm run start
```

---

```bash
npm run start

Verifying config...
Config is valid, let's proceed
29 products found in collection
Filtering Products with excluded options: Limited, Johnny Cupcakes
60 variants are eligible for discount
Updating variants with metafield { namespace: 'debut', key: 'is_bogo', type: 'boolean' } and value true
60 variant metafields were updated
Creating discount for variants
Discount created with id gid://shopify/DiscountAutomaticNode/123456
```

Please check that the discount was created correctly.

\*\* The discount will be created without an end date this is by design.
