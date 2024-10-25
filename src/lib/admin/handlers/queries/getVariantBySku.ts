const query = `#graphql
  query GetVariantBySku($sku: String!) {
    productVariants(first: 1, query: $sku) {
      edges {
        node {
          id
          title
          sku
          product {
            handle
            title
          }
        }
      }
    }
  }
`;

export default query;
