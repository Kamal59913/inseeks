export type DateFormat =
  | "date" // "Apr 17, 2025"
  | "time" // "10:16 AM"
  | "datetime" // "Apr 17, 2025, 10:16 AM"
  | "iso" // "2025-04-17"
  | "full" // "Thursday, April 17, 2025, 10:16 AM"
  | "custom" // use with customFormat option
  | "dayFirst"; // use with customFormat option

interface FormatDateOptions {
  format?: DateFormat;
  locale?: string;
  customFormat?: Intl.DateTimeFormatOptions;
  timeZone?: string;
}

export function formatDate(
  dateInput: string | Date,
  options: FormatDateOptions = {}
): string {
  const {
    format = "datetime",
    locale = "en-US",
    customFormat,
    timeZone = "UTC",
  } = options;

  const date = new Date(dateInput);

  const formatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    date: { year: "numeric", month: "short", day: "numeric", timeZone },
    time: { hour: "numeric", minute: "numeric", timeZone },
    datetime: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone,
    },
    iso: {}, // special case
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone,
    },
    custom: customFormat || {}, // fallback to empty if not provided
    dayFirst: {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone,
    },
  };

  if (format === "iso") {
    return date.toLocaleDateString("en-CA");
  }

  if (format === "dayFirst") {
    const day = date.getDate();
    const month = date.toLocaleDateString(locale, { month: "short", timeZone });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const formatter = new Intl.DateTimeFormat(locale, formatOptions[format]);
  return formatter.format(date);
}

export const formatMinutesToDecimalHours = (minutes: number) => {
  if (!minutes || minutes <= 0) return "0 hours";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
  }

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;
};

export const formatDateTime = (
  dateString: string,
  format: "short" | "long" = "long"
) => {
  try {
    // Extract date parts manually (no timezone conversion)
    const [datePart, timePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-");
    const [hourStr, minuteStr] = timePart.replace("Z", "").split(":");

    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Convert to readable 12-hour time
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const timeFormatted = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;

    if (format === "short") {
      // Format: "05 Jan 2026, 01:01 pm"
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthName = monthNames[parseInt(month, 10) - 1];
      return `${day} ${monthName} ${year}, ${timeFormatted}`;
    }

    // Format: "Monday 1:01PM" (original long format)
    const dateUTC = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day))
    );
    const dayLabel = dateUTC.toLocaleDateString("en-US", { weekday: "long" });
    const timeFormattedLong = `${hour12}:${minute.toString().padStart(2, "0")}${ampm.toUpperCase()}`;
    return `${dayLabel} ${timeFormattedLong}`;
  } catch (error) {
    return "Invalid date";
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const targetDate = new Date(dateString);
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      return "Started";
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0 || parts.length === 0)
      parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);

    return `Starts in ${parts.join(", ")}`;
  } catch (error) {
    return "Invalid date";
  }
};
