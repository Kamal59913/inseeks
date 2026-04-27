export const MAX_LENGTH_BUFFER = 1;

export const getBufferedMaxLength = (
  maxLength: number | undefined,
): number | undefined =>
  typeof maxLength === "number" ? maxLength + MAX_LENGTH_BUFFER : undefined;
