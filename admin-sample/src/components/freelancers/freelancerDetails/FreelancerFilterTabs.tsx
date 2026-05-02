import React from "react";

type FilterTabsProps = {
  activeTab: "profile" | "booking" | "edit_profile" | "referral_details";
  onChange: (
    tab: "profile" | "booking" | "edit_profile" | "referral_details",
  ) => void;
  referralCount?: number;
};

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeTab,
  onChange,
  referralCount,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.preventDefault();
          onChange("profile");
        }}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === "profile"
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Profile Details
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          onChange("booking");
        }}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === "booking"
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Booking Details
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          onChange("referral_details");
        }}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === "referral_details"
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Referred Details {referralCount !== undefined && `(${referralCount})`}
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          onChange("edit_profile");
        }}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          activeTab === "edit_profile"
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        Edit Profile
      </button>
    </div>
  );
};
