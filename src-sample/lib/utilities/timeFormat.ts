export type DateFormat =
  | "date" // "Apr 17, 2025"
  | "time" // "10:16 AM"
  | "datetime" // "Apr 17, 2025, 10:16 AM"
  | "iso" // "2025-04-17"
  | "full" // "Thursday, April 17, 2025, 10:16 AM"
  | "custom" // use with customFormat option
  | "dayFirst" // "17 Apr, 2025"
  | "short" // "17 Jan 2026, 01:01 pm"
  | "long" // "Monday 1:01PM"
  | "relative"; // "Starts in ..."

interface FormatDateOptions {
  format?: DateFormat;
  locale?: string;
  customFormat?: Intl.DateTimeFormatOptions;
  timeZone?: string;
}

export function formatDate(
  dateInput: string | Date,
  options: FormatDateOptions = {},
): string {
  const {
    format = "datetime",
    locale = "en-US",
    customFormat,
    timeZone = "UTC",
  } = options;

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return "Invalid date";

  if (format === "iso") {
    return date.toLocaleDateString("en-CA");
  }

  if (format === "dayFirst") {
    const day = date.getDate();
    const month = date.toLocaleDateString(locale, { month: "short", timeZone });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  if (format === "short") {
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString(locale, { month: "short", timeZone });
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${day} ${month} ${year}, ${hour12}:${minutes} ${ampm}`;
  }

  if (format === "long") {
    const dayLabel = date.toLocaleDateString(locale, {
      weekday: "long",
      timeZone,
    });
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${dayLabel} ${hour12}:${minutes}${ampm}`;
  }

  if (format === "relative") {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

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
  }

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
    iso: {},
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone,
    },
    custom: customFormat || {},
    dayFirst: {}, // handled above
    short: {}, // handled above
    long: {}, // handled above
    relative: {}, // handled above
  };

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

