export type MetalPrice = {
  yesterday: number | null;
  today: number | null;
};

export type MetalPriceData = {
  gold: MetalPrice;
  silver: MetalPrice;
};
