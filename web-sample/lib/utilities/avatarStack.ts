export const getAvatarDisplaySlots = (
  totalCount: string | number | undefined,
  avatarUrls: string[] | undefined,
  maxVisible: number,
): Array<string | null> => {
  const normalizedCount = Math.max(0, Number(totalCount) || 0);
  const visibleCount = Math.min(normalizedCount, maxVisible);

  return Array.from({ length: visibleCount }, (_, idx) => {
    const avatar = avatarUrls?.[idx];
    return typeof avatar === "string" && avatar.trim().length > 0 ? avatar : null;
  });
};
