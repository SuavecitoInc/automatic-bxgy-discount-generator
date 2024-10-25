const mutation = `#graphql
  mutation UpdateVariantMetafields($metafields: [MetafieldsSetInput!]!,) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
        code
      }
    }

  }
`;

export default mutation;
