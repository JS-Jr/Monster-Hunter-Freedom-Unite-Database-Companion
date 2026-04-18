export const encodeName = (value: string): string => {
  console.log("Encoding value:", value);
  return encodeURIComponent(value.replace(/\+/g, "plus"));
};

export const decodeName = (value: string): string => {
  console.log("Decoding value:", value);
  return decodeURIComponent(value.replace(/plus/g, "+"));
};
