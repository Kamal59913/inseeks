export const USER_AVATAR_COLORS = [
  "#F4433633",
  "#E91E6333",
  "#9C27B033",
  "#673AB733",
  "#3F51B533",
  "#2196F333",
  "#03A9F433",
  "#00BCD433",
  "#00968833",
  "#4CAF5033",
  "#8BC34A33",
  "#CDDC3933",
  "#FFEB3B33",
  "#FFC10733",
  "#FF980033",
  "#FF572233",
];

/**
 * Gets the initials of a name. Returns two capitalized characters.
 * Preferably the first character of the first and last name.
 */
export const getUserInitials = (name: string): string => {
  if (!name) return "??";
  const trimmedName = name.trim();
  const parts = trimmedName.split(/\s+/);

  if (parts.length >= 2) {
    const firstInitial = parts[0]?.[0];
    const lastInitial = parts[parts.length - 1]?.[0];
    if (firstInitial && lastInitial) {
      return (firstInitial + lastInitial).toUpperCase();
    }
  }

  if (trimmedName.length >= 2) {
    return trimmedName.slice(0, 2).toUpperCase();
  }

  const initial = trimmedName[0];
  return initial ? (initial + initial).toUpperCase() : "??";
};

/**
 * Gets a random color from USER_AVATAR_COLORS based on a seed (usually user ID or username).
 */
export const getRandomUserColor = (seed: string | number): string => {
  const seedString = String(seed);
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % USER_AVATAR_COLORS.length;
  return USER_AVATAR_COLORS[index] as string;
};
