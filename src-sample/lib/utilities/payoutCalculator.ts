export const calculatePayout = (
  price: number,
  platformFee: number,
  stripeFee: number,
) => {
  if (!price) return "";
  const platformAmount = (platformFee / 100) * price;
  const stripeAmount = (stripeFee / 100) * price;
  return (price - (platformAmount + stripeAmount)).toFixed(2);
};

