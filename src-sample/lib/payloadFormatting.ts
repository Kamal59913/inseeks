export const addressUtils = {
  concatenateAddress: (fields: {
    streetOne?: string;
    streetTwo?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    state?: string;
  }): string => {
    const parts = [
      fields.streetOne,
      fields.streetTwo,
      fields.address,
      fields.city,
      fields.state,
      fields.postalCode,
    ].filter(Boolean);

    return parts.join(", ");
  },

  getFreelancerAddress: (formData: any) => {
    return {
      postcode: formData.freelancerPostalCode || "",
      address: formData.freelancerAddress || "",
    };
  },
};

