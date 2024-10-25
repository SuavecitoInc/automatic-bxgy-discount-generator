const query = `#graphql
  query GetCollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      products(first: 250, reverse: true) {
        edges {
          node {
            id
            title
            variants(first: 50) {
              edges {
                node {
                  id
                  sku
                  title
                  price
                  compareAtPrice
                  product {
                    id
                    title
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default query;
