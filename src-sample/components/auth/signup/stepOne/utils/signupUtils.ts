export interface CategoryField {
  key: "hourly" | "half_day" | "full_day";
  label: string;
}

export interface CategoryConfig {
  name: string;
  fields: CategoryField[];
}

export const getCategoryConfig = (
  name: string,
  slug: string
): CategoryConfig => {
  const normalizedSlug = slug.toLowerCase();
  const normalizedName = name.toLowerCase();

  // Nails: Only 2 visible fields
  if (normalizedSlug.includes("nail") || normalizedName.includes("nail")) {
    return {
      name: "Nails",
      fields: [
        { key: "hourly", label: "Min. press ons (per set)" },
        { key: "half_day", label: "Min. nail art (per set)" },
      ],
    };
  }

  // Hair
  if (normalizedSlug.includes("hair") || normalizedName.includes("hair")) {
    return {
      name: "Hair",
      fields: [
        { key: "hourly", label: "Min. style and go" },
        { key: "half_day", label: "Min. half day shoot rate (4h)" },
        { key: "full_day", label: "Min. full day shoot rate" },
      ],
    };
  }

  // Default / Makeup
  return {
    name: "Makeup",
    fields: [
      { key: "hourly", label: "Min. glam and go" },
      { key: "half_day", label: "Min. half day shoot rate (4h)" },
      { key: "full_day", label: "Min. full day shoot rate" },
    ],
  };
};

