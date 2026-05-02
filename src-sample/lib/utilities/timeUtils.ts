/**
 * Converts a time string like "12:00pm" or "1:30am" to "HH:mm" 24-hour format.
 */
export function convertTo24Hour(time: string): string {
  const [timePart, ampm] = time.match(/(\d+:\d+|\d+)(am|pm)/i)?.slice(1) || [];
  if (!timePart || !ampm) return "12:00";

  let [hours, minutes] = timePart.includes(":")
    ? timePart.split(":").map(Number)
    : [Number(timePart), 0];

  if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")}`;
}
