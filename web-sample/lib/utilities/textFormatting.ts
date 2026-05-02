export const collapseBlankLineRuns = (
  text: string,
  maxBlankLines = 0,
): string => {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let blankLineRun = 0;

  return lines
    .filter((line) => {
      if (line.trim().length > 0) {
        blankLineRun = 0;
        return true;
      }

      blankLineRun += 1;
      return blankLineRun <= maxBlankLines;
    })
    .join("\n");
};
