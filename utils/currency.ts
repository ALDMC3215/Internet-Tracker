
export const formatToman = (rials: number): string => {
  const toman = Math.round(rials / 10);
  return new Intl.NumberFormat('fa-IR').format(toman);
};

export const tomanToRial = (toman: number): number => {
  return toman * 10;
};

export const rialToToman = (rial: number): number => {
    return Math.round(rial / 10);
};
