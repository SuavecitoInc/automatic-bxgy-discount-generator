import type {
  GetCollectionByHandleQuery,
  UpdateVariantMetafieldsMutation,
} from './lib/types/admin.generated';
import { createDiscountInput, shopifyAdmin, verifyConfig } from './lib/utils';
import { getCollectionByHandle as QueryGetCollectionByHandle } from './lib/admin/handlers/queries';
import {
  createAutomaticBxgyDiscount as MutationCreateAutomaticBxgyDiscount,
  updateVariantMetafields as MutationUpdateVariantMetafields,
} from './lib/admin/handlers/mutations';

import config from '../config';

async function getProductsFromCollection(handle: string) {
  // get products from collection
  const response = await shopifyAdmin<GetCollectionByHandleQuery>(
    QueryGetCollectionByHandle,
    {
      handle,
    },
  );

  if (response.error) {
    console.log('ERROR', response.error);
    return null;
  }

  if (!response.data.collectionByHandle) {
    console.log('Collection not found');
    return null;
  }

  return response.data.collectionByHandle.products.edges;
}

function filterProducts(
  products: GetCollectionByHandleQuery['collectionByHandle']['products']['edges'],
) {
  // use config to filter out products that are excluded
  console.log(
    'Filtering products with excluded options:',
    config.excludedOptions.map((option) => option).join(', '),
  );
  const filteredVariants: {
    id: string;
    sku: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
  }[] = [];
  for (const product of products) {
    for (const variant of product.node.variants.edges) {
      const hasExcludedOption = variant.node.selectedOptions.some((option) =>
        config.excludedOptions.includes(option.value),
      );
      if (!hasExcludedOption) {
        filteredVariants.push({
          id: variant.node.id,
          sku: variant.node.sku,
          title: `${product.node.title} - ${variant.node.title}`,
          selectedOptions: variant.node.selectedOptions,
        });
      }
    }
  }
  return filteredVariants;
}

async function createDiscount(variants: string[]) {
  console.log('Creating discount for variants');
  // create discount
  const input = createDiscountInput(variants);

  const response = await shopifyAdmin<any>(
    MutationCreateAutomaticBxgyDiscount,
    input,
  );

  if (response.error) {
    console.log('ERROR', response.error);
    return null;
  }
  const discount =
    response.data.discountAutomaticBxgyCreate.automaticDiscountNode.id;
  console.log('Discount created with id', discount);
  return response.data;
}

async function updateVariantMetafield(
  metafield: {
    namespace: string;
    key: string;
    type: string;
  },
  ownerId: string,
  value: string,
) {
  const { namespace, key, type } = metafield;

  const response = await shopifyAdmin<UpdateVariantMetafieldsMutation>(
    MutationUpdateVariantMetafields,
    {
      metafields: [
        {
          namespace,
          key,
          ownerId,
          type,
          value,
        },
      ],
    },
  );

  if (response.error) {
    console.log('ERROR', response.error);
    return null;
  }

  if (!response.data) {
    console.log('NO DATA', response);
    return null;
  }

  return response;
}

async function updateVariants(variantIds: string[]) {
  const metafield = {
    namespace: 'debut',
    key: 'is_bogo',
    type: 'boolean',
  };
  const value = 'true';

  console.log(
    'Updating variants with metafield',
    metafield,
    'and value',
    value,
  );

  const updated = variantIds.map(async (id) => {
    const response = await updateVariantMetafield(metafield, id, value);
    return response;
  });

  const results = await Promise.all(updated);

  console.log(results.length, 'variant metafields were updated');
  return results;
}

async function main() {
  try {
    // verify config
    console.log('Verifying config...');
    const isValid = verifyConfig();
    if (!isValid) {
      console.log('Invalid config');
      console.log('Please check your config file for the following errors:');
      isValid.errors.forEach((error) => {
        console.log(error);
      });
      return;
    }
    console.log("Config is valid, let's proceed");
    // get products from collection
    const products = await getProductsFromCollection(
      config.collectionHandle || 'mens-hair',
    );
    if (!products) {
      console.log('No products found');
      return;
    }
    console.log(products.length, 'products found');
    // use config to filter out products that are excluded
    const filteredVariants = filterProducts(products);
    if (!filteredVariants) {
      console.log('No filtered products found');
      return;
    }

    const variantIds = filteredVariants.map((variant) => variant.id);
    console.log(variantIds.length, 'variants are eligible for discount');

    // set metafield
    await updateVariants(variantIds);
    // create discount
    await createDiscount(variantIds);
  } catch (err: any) {
    console.log('ERROR', err);
  }
}

main();
