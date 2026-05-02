"use client";

import React from "react";
import AccountSettings from "./AccountSettings/AccountSettingsForm";
import PrivacySettings from "./PrivacySettings/PrivacySettingsForm";
import NotificationsSettings from "./NotificationSettings/NotificationsSettingsForm";
import PasswordSettings from "./PasswordSettings/PasswordSettingsForm";
import DeactivateSettings from "./DeactivateSettings/DeactiveSettingsForm";

const Settings = () => {
  return (
    <div className="flex flex-col pb-20">
      <NotificationsSettings />
      <PrivacySettings />
      <AccountSettings />
      {/* <PasswordSettings /> */}
      <DeactivateSettings />
    </div>
  );
};

export default Settings;
