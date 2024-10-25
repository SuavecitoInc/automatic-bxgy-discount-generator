/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type CreateAutomaticBxgyDiscountMutationVariables = AdminTypes.Exact<{
  automaticBxgyDiscount: AdminTypes.DiscountAutomaticBxgyInput;
}>;


export type CreateAutomaticBxgyDiscountMutation = { discountAutomaticBxgyCreate?: AdminTypes.Maybe<{ automaticDiscountNode?: AdminTypes.Maybe<Pick<AdminTypes.DiscountAutomaticNode, 'id'>>, userErrors: Array<Pick<AdminTypes.DiscountUserError, 'field' | 'message'>> }> };

export type UpdateVariantMetafieldsMutationVariables = AdminTypes.Exact<{
  metafields: Array<AdminTypes.MetafieldsSetInput> | AdminTypes.MetafieldsSetInput;
}>;


export type UpdateVariantMetafieldsMutation = { metafieldsSet?: AdminTypes.Maybe<{ metafields?: AdminTypes.Maybe<Array<Pick<AdminTypes.Metafield, 'key' | 'namespace' | 'value' | 'createdAt' | 'updatedAt'>>>, userErrors: Array<Pick<AdminTypes.MetafieldsSetUserError, 'field' | 'message' | 'code'>> }> };

export type UpdateVariantPriceAndMetafieldsMutationVariables = AdminTypes.Exact<{
  metafields: Array<AdminTypes.MetafieldsSetInput> | AdminTypes.MetafieldsSetInput;
  input: AdminTypes.ProductVariantInput;
}>;


export type UpdateVariantPriceAndMetafieldsMutation = { metafieldsSet?: AdminTypes.Maybe<{ metafields?: AdminTypes.Maybe<Array<Pick<AdminTypes.Metafield, 'key' | 'namespace' | 'value' | 'createdAt' | 'updatedAt'>>>, userErrors: Array<Pick<AdminTypes.MetafieldsSetUserError, 'field' | 'message' | 'code'>> }>, productVariantUpdate?: AdminTypes.Maybe<{ productVariant?: AdminTypes.Maybe<Pick<AdminTypes.ProductVariant, 'id' | 'price' | 'compareAtPrice'>> }> };

export type GetCollectionByHandleQueryVariables = AdminTypes.Exact<{
  handle: AdminTypes.Scalars['String']['input'];
}>;


export type GetCollectionByHandleQuery = { collectionByHandle?: AdminTypes.Maybe<(
    Pick<AdminTypes.Collection, 'id' | 'title'>
    & { products: { edges: Array<{ node: (
          Pick<AdminTypes.Product, 'id' | 'title'>
          & { variants: { edges: Array<{ node: (
                Pick<AdminTypes.ProductVariant, 'id' | 'sku' | 'title' | 'price' | 'compareAtPrice'>
                & { product: Pick<AdminTypes.Product, 'id' | 'title'>, selectedOptions: Array<Pick<AdminTypes.SelectedOption, 'name' | 'value'>> }
              ) }> } }
        ) }> } }
  )> };

export type GetVariantBySkuQueryVariables = AdminTypes.Exact<{
  sku: AdminTypes.Scalars['String']['input'];
}>;


export type GetVariantBySkuQuery = { productVariants: { edges: Array<{ node: (
        Pick<AdminTypes.ProductVariant, 'id' | 'title' | 'sku'>
        & { product: Pick<AdminTypes.Product, 'handle' | 'title'> }
      ) }> } };

interface GeneratedQueryTypes {
  "#graphql\n  query GetCollectionByHandle($handle: String!) {\n    collectionByHandle(handle: $handle) {\n      id\n      title\n      products(first: 250, reverse: true) {\n        edges {\n          node {\n            id\n            title\n            variants(first: 50) {\n              edges {\n                node {\n                  id\n                  sku\n                  title\n                  price\n                  compareAtPrice\n                  product {\n                    id\n                    title\n                  }\n                  selectedOptions {\n                    name\n                    value\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": {return: GetCollectionByHandleQuery, variables: GetCollectionByHandleQueryVariables},
  "#graphql\n  query GetVariantBySku($sku: String!) {\n    productVariants(first: 1, query: $sku) {\n      edges {\n        node {\n          id\n          title\n          sku\n          product {\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n": {return: GetVariantBySkuQuery, variables: GetVariantBySkuQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n  mutation CreateAutomaticBxgyDiscount($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {\n    discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {\n      automaticDiscountNode {\n        # DiscountAutomaticNode fields\n        id\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: CreateAutomaticBxgyDiscountMutation, variables: CreateAutomaticBxgyDiscountMutationVariables},
  "#graphql\n  mutation UpdateVariantMetafields($metafields: [MetafieldsSetInput!]!,) {\n    metafieldsSet(metafields: $metafields) {\n      metafields {\n        key\n        namespace\n        value\n        createdAt\n        updatedAt\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n\n  }\n": {return: UpdateVariantMetafieldsMutation, variables: UpdateVariantMetafieldsMutationVariables},
  "#graphql\n  mutation UpdateVariantPriceAndMetafields($metafields: [MetafieldsSetInput!]!, $input: ProductVariantInput!) {\n    metafieldsSet(metafields: $metafields) {\n      metafields {\n        key\n        namespace\n        value\n        createdAt\n        updatedAt\n      }\n      userErrors {\n        field\n        message\n        code\n      }\n    }\n    productVariantUpdate(input: $input) {\n      productVariant {\n        id\n        price\n        compareAtPrice\n      }\n    }\n  }\n": {return: UpdateVariantPriceAndMetafieldsMutation, variables: UpdateVariantPriceAndMetafieldsMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
