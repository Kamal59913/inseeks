export type LinkifiedSegment =
  | {
      type: "text";
      value: string;
    }
  | {
      type: "link";
      value: string;
      href: string;
    };

const URL_PATTERN =
  /\b((?:https?:\/\/|www\.)[^\s<]+|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?:\/[^\s<]*)?)/gi;

const TRAILING_PUNCTUATION = new Set([".", ",", "!", "?", ":", ";"]);
const TRAILING_BRACKETS: Record<string, string> = {
  ")": "(",
  "]": "[",
  "}": "{",
};

const countCharacter = (value: string, target: string) =>
  value.split(target).length - 1;

const trimTrailingUrlCharacters = (candidate: string) => {
  let end = candidate.length;

  while (end > 0 && TRAILING_PUNCTUATION.has(candidate.charAt(end - 1))) {
    end -= 1;
  }

  while (end > 0) {
    const lastCharacter = candidate.charAt(end - 1);
    if (!lastCharacter) {
      break;
    }

    const matchingOpenBracket = TRAILING_BRACKETS[lastCharacter];

    if (!matchingOpenBracket) {
      break;
    }

    const currentValue = candidate.slice(0, end);
    const openCount = countCharacter(currentValue, matchingOpenBracket);
    const closeCount = countCharacter(currentValue, lastCharacter);

    if (closeCount > openCount) {
      end -= 1;
      continue;
    }

    break;
  }

  return {
    trimmedUrl: candidate.slice(0, end),
    trailingText: candidate.slice(end),
  };
};

const normalizeUrl = (value: string) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

export const getLinkifiedSegments = (text: string): LinkifiedSegment[] => {
  if (!text) {
    return [];
  }

  const segments: LinkifiedSegment[] = [];
  let cursor = 0;
  URL_PATTERN.lastIndex = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const rawMatch = match[0];
    const start = match.index ?? 0;
    const end = start + rawMatch.length;

    if (start > cursor) {
      segments.push({
        type: "text",
        value: text.slice(cursor, start),
      });
    }

    const previousCharacter = start > 0 ? text.charAt(start - 1) : "";
    if (previousCharacter === "@") {
      segments.push({
        type: "text",
        value: rawMatch,
      });
      cursor = end;
      continue;
    }

    const { trimmedUrl, trailingText } = trimTrailingUrlCharacters(rawMatch);

    if (!trimmedUrl) {
      segments.push({
        type: "text",
        value: rawMatch,
      });
      cursor = end;
      continue;
    }

    segments.push({
      type: "link",
      value: trimmedUrl,
      href: normalizeUrl(trimmedUrl),
    });

    if (trailingText) {
      segments.push({
        type: "text",
        value: trailingText,
      });
    }

    cursor = end;
  }

  if (cursor < text.length) {
    segments.push({
      type: "text",
      value: text.slice(cursor),
    });
  }

  return segments;
};
