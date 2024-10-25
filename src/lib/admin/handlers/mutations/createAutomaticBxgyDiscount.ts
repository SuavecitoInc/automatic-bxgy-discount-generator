const mutation = `#graphql
  mutation CreateAutomaticBxgyDiscount($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
    discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
      automaticDiscountNode {
        # DiscountAutomaticNode fields
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export default mutation;
