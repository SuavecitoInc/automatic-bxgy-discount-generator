import type {
  GetCollectionByHandleQuery,
  UpdateVariantMetafieldsMutation,
  CreateAutomaticBxgyDiscountMutation,
} from './lib/types/admin.generated';
import {
  createDiscountInput,
  shopifyAdmin,
  verifyConfig,
  writeToFile,
} from './lib/utils';
import { getCollectionByHandle as QueryGetCollectionByHandle } from './lib/admin/handlers/queries';
import {
  createAutomaticBxgyDiscount as MutationCreateAutomaticBxgyDiscount,
  updateVariantMetafields as MutationUpdateVariantMetafields,
} from './lib/admin/handlers/mutations';

import config from '../config';

type Products =
  GetCollectionByHandleQuery['collectionByHandle']['products']['edges'];

async function getProductsFromCollection() {
  // get products from collection
  let products: Products = [];
  async function getProducts(cursor?: string) {
    const response = await shopifyAdmin<GetCollectionByHandleQuery>(
      QueryGetCollectionByHandle,
      {
        handle: config.collectionHandle || 'mens-hair',
        namespace: config?.excludedByMetafield?.namespace || 'test',
        key: config?.excludedByMetafield?.key || 'test',
        cursor,
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

    const hasNextPage =
      response.data.collectionByHandle.products.pageInfo.hasNextPage;
    const endCursor =
      response.data.collectionByHandle.products.pageInfo.endCursor;

    products = products.concat(response.data.collectionByHandle.products.edges);

    if (hasNextPage) {
      console.log('Fetching more products...');
      await getProducts(endCursor);
    } else {
      console.log('All products fetched');
    }
  }

  await getProducts();
  return products;
}

type EligibleVariant = {
  id: string;
  sku: string;
  title: string;
  selectedOptions: { name: string; value: string }[];
  excludeFromDiscounts: boolean;
};

function filterProducts(products: Products) {
  // use config to filter out products that are excluded
  console.log(
    'Filtering products with excluded options:',
    config.excludedByOptions.map((option) => option).join(', '),
  );
  const filteredVariants: string[] = [];
  const filteredProducts: string[] = [];
  const variantsToMutate: string[] = [];
  for (const product of products) {
    const variantLength = product.node.variants.edges.length;
    const eligibleVariants: EligibleVariant[] = [];
    for (const variant of product.node.variants.edges) {
      const hasExcludedOption =
        config.excludedByOptions.length > 0
          ? variant.node.selectedOptions.some((option) =>
              config.excludedByOptions.includes(option.value),
            )
          : false;

      const excludeFromDiscounts =
        variant.node.excludeFromDiscounts?.value === 'true';

      if (!hasExcludedOption && !excludeFromDiscounts) {
        eligibleVariants.push({
          id: variant.node.id,
          sku: variant.node.sku,
          title: `${product.node.title} - ${variant.node.title}`,
          selectedOptions: variant.node.selectedOptions,
          excludeFromDiscounts,
        });
      }
    }
    // add all eligible variants to filteredVariants
    variantsToMutate.push(...eligibleVariants.map((variant) => variant.id));
    if (eligibleVariants.length !== variantLength) {
      // filteredVariants.push(...eligibleVariants);
      filteredVariants.push(...eligibleVariants.map((variant) => variant.id));
    } else {
      filteredProducts.push(product.node.id);
    }
  }

  return {
    filteredVariants,
    filteredProducts,
    variantsToMutate,
  };
}

async function createDiscount(products: string[], variants: string[]) {
  console.log('Creating discount for variants');
  // create discount
  const input = createDiscountInput(products, variants);

  const response = await shopifyAdmin<CreateAutomaticBxgyDiscountMutation>(
    MutationCreateAutomaticBxgyDiscount,
    input,
  );

  console.log('CREATE DISCOUNT RESPONSE', JSON.stringify(response, null, 2));

  if (response.error) {
    console.log('ERROR', response.error);
    throw new Error('Error creating discount');
  }
  const discount =
    response.data.discountAutomaticBxgyCreate.automaticDiscountNode.id;
  console.log('Discount created with id', discount);
  return response.data;
}

async function updateVariantMetafields(
  metafields: {
    namespace: string;
    key: string;
    type: string;
    value: string;
  }[],
  ownerId: string,
) {
  const response = await shopifyAdmin<UpdateVariantMetafieldsMutation>(
    MutationUpdateVariantMetafields,
    {
      metafields: metafields.map((metafield) => ({
        namespace: metafield.namespace,
        key: metafield.key,
        ownerId,
        type: metafield.type,
        value: metafield.value,
      })),
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
  const { metafields } = config;

  console.log('Updating variants with metafield', metafields);

  const updated = variantIds.map(async (id) => {
    const response = await updateVariantMetafields(metafields, id);
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
    const products = await getProductsFromCollection();
    if (!products) {
      console.log('No products found');
      return;
    }
    console.log(products.length, 'products found');

    // use config to filter out products that are excluded
    const {
      filteredProducts: productIds,
      filteredVariants: variantIds,
      variantsToMutate,
    } = filterProducts(products);
    if (!variantIds.length) {
      console.log('No filtered products found');
      return;
    }

    console.log(variantIds.length, 'variants are eligible for discount');
    console.log(productIds.length, 'products are eligible for discount');
    console.log(variantsToMutate.length, 'variants to mutate');

    // const variantIds = filteredVariants.map((variant) => variant.id);
    // console.log(variantIds.length, 'variants are eligible for discount');

    // set metafield
    if (config.metafields) {
      await updateVariants(variantsToMutate);
    }
    // write eligible variant ids to file
    await writeToFile(
      'eligible-variant-ids',
      JSON.stringify(variantsToMutate, null, 2),
    );
    // create discount
    await createDiscount(productIds, variantIds);
  } catch (err: any) {
    console.log('ERROR', err);
  }
}

main();
