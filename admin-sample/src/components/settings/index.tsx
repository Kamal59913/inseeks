import { useState } from "react";
import ProfileForm from "./profile-form/profileForm";
import PasswordForm from "./password-reset/passwordForm";
import PlateformFeeForm from "./plateform-fee/plateformFeeForm";
import CustomerFeeForm from "./customer-fee/customerFeeForm";

const settingsSections = [
  "Profile",
  "Password",
  "Plateform Fee",
  "Service Fee"
];

const DashboardSettings = () => {
  const [activeSection, setActiveSection] = useState("Profile");

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "Profile":
        return <ProfileForm />;
      case "Password":
        return <PasswordForm />;
      case "Plateform Fee":
        return <PlateformFeeForm />;
      case "Service Fee":
        return <CustomerFeeForm />;
      default:
        return (
          <div className="rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ">
            <div className="px-6 py-5">
              <h3 className="text-lg font-semibold text-black dark:text-white/90">
                No Data
              </h3>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6"></div>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="rounded p-6 border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] cstm-setting-column">
        <h3 className="text-lg font-semibold text-black dark:text-white/90 mb-4">
          Settings
        </h3>
        <div className="space-y-1">
          {settingsSections.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(item)}
              className={`w-full text-left px-3 py-2 rounded-md ${
                activeSection === item
                  ? "bg-primary/10 text-primary dark:text-primary font-semibold"
                  : "text-black dark:text-white/90 hover:bg-gray-100 dark:hover:bg-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">{renderSettingsContent()}</div>
    </div>
  );
};

export default DashboardSettings;
