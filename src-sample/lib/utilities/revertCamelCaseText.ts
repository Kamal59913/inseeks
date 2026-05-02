export const formatFieldName = (name: string) => {
  return name
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

