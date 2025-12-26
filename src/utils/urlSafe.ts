export const encodeName = (value: string): string => {
  return encodeURIComponent(value.replace(/\+/g, "plus"));
};

export const decodeName = (value: string): string => {
  return decodeURIComponent(value.replace(/plus/g, "+"));
};
