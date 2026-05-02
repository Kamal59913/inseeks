import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  Switch,
  FieldGroup,
} from "@repo/ui/index";
import { ChevronRight, User, Users, MicOff } from "lucide-react";
import { usePrivacySettingsForm } from "./use-privacy-settings-form.hook";
import { PrivacySettingsValidationType } from "./privacy-settings.validation";

import BlockedUsersModal from "../../Modals/BlockedUsersModal";
import { useState } from "react";

const PrivacySettings = () => {
  const form = usePrivacySettingsForm();
  const [isBlockedUsersModalOpen, setIsBlockedUsersModalOpen] = useState(false);
  const [isMutedUsersModalOpen, setIsMutedUsersModalOpen] = useState(false);

  const onSubmit = (data: PrivacySettingsValidationType) => {
    console.log("Updated privacy settings", data);
  };

  return (
    <div className="px-3 border-gray-100 mt-4">
      <div className="bg-[#fcf7fe] p-3 rounded-lg">
        <h3 className="mb-3 font-semibold text-gray-900">Privacy & Safety</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          
          <FieldGroup className="space-y-4">
            {/* Private Account Switch - Full Width */}
            {/* <FormField
              control={form.control}
              name="privateAccount"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between py-2 bg-white px-3 rounded-lg">
                  <div className="flex items-center gap-3 m-0">
                      <User className="w-5 h-5 text-gray-500" />
                      <FormLabel className="text-gray-700 text-sm leading-relaxed">Private Account</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      size="sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              
              {/* Blocked Users List */}
              <div 
                className="flex items-center justify-between py-2 bg-white px-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsBlockedUsersModalOpen(true)}
              >
                <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm leading-relaxed">Blocked Users List</span>
                </div>
                <div className="bg-gray-100 rounded-full p-1">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Muted Users List */}
              <div 
                className="flex items-center justify-between py-2 bg-white px-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMutedUsersModalOpen(true)}
              >
                <div className="flex items-center gap-3">
                    <MicOff className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm leading-relaxed">Muted Users List</span>
                </div>
                <div className="bg-gray-100 rounded-full p-1">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

            </div>
          </FieldGroup>

        </form>
      </Form>
        </div>

      <BlockedUsersModal 
        isOpen={isBlockedUsersModalOpen} 
        onClose={() => setIsBlockedUsersModalOpen(false)} 
        type="blocked"
      />
      <BlockedUsersModal 
        isOpen={isMutedUsersModalOpen} 
        onClose={() => setIsMutedUsersModalOpen(false)} 
        type="muted"
      />
    </div>
  );
};

export default PrivacySettings;