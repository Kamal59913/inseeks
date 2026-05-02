import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import Switch from "@/components/ui/form/Switch";
import { Controller } from "react-hook-form";
import { ToastService } from "@/lib/utilities/toastService";
import walletService from "@/services/walletService";
import { usePaymentSettings } from "./hook/payment-settings-form.hook";
import { useGetBillingDetails } from "@/hooks/walletServices/useGetBillingDetails";
import { useModalData } from "@/store/hooks/useModal";
import { useDispatch } from "react-redux";
import { setStripeSaveStatus } from "@/store/slices/executionSlice";
import { useTutorial } from "@/store/hooks/useTutorials";
import tutorialsService from "@/services/tutorialsService";

import { useGetStripeAccountInfo } from "@/hooks/walletServices/useGetStripeAccountInfo";
import { Loader2 } from "lucide-react";
import {
  BillingInfoPayload,
  StripeExternalAccount,
} from "@/types/api/wallet.types";

interface PaymentSettingsShhetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentSettingsShhet({
  isOpen,
  onClose,
}: PaymentSettingsShhetProps) {
  const { data: localData } = useGetBillingDetails();
  const { data: stripeAccountInfo, isLoading: isStripeLoading } = useGetStripeAccountInfo({
    enabled: isOpen,
  });
  const [isGenerateInvoice, setIsGenerateInvoice] = useState(true);
  const { open, close } = useModalData();
  const dispatch = useDispatch();
  const { currentStep, setTutorialStep } = useTutorial();

  const formMethods = usePaymentSettings(localData?.data, isGenerateInvoice);

  const isInvoiceEnabled = formMethods.watch("generateInvoices");

  const handleConnectStripe = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response: any = await walletService?.createConnectAccount();
    if (response?.data?.url) {
      dispatch(setStripeSaveStatus("success"));
      if (currentStep === 6) {
        setTutorialStep(7);
        await tutorialsService.updateTutorialStep(7);
      }

      window.location.href = response.data.url;
    }
  };

  const submitSettings = async (data: {
    generateInvoices: boolean;
    billingName?: string;
    address1?: string;
    address2?: string;
    postcode?: string;
    city?: string;
    vatNumber?: string;
  }) => {
    const response = await walletService?.updateBillingInfo(data as BillingInfoPayload);
    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Updated billing details successfully",
      );
      onClose();
    } else {
      if (response?.status !== 401) {
        ToastService.error(
          response.data.message || "Failed to update billling details",
        );
      }
    }
  };

  useEffect(() => {
    const subscription = formMethods.watch((value, { name }) => {
      if (name === "generateInvoices") {
        setIsGenerateInvoice(value.generateInvoices ?? true);
      }
    });

    return () => subscription.unsubscribe();
  }, [formMethods]);

  const bankAccounts = stripeAccountInfo?.data?.external_accounts?.data || [];

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="bottom"
        className="sheet-gradient-bg border-none px-0 pt-0 pb-10 overflow-y-auto scrollbar-hide"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700/40 h-full">
          <Button
            variant="glass"
            size="sm"
            borderRadius="rounded-[16px]"
            className="font-medium active:scale-95 transition-all"
            onClick={onClose}
          >
            Cancel
          </Button>

          <h2 className="text-white font-medium">Payment Settings</h2>

          <Button
            variant="white"
            borderRadius="rounded-[16px]"
            className="font-medium active:scale-95 transition-all"
            size="sm"
            onClick={() => {
              open("submit-confirmation", {
                title: "Confirm saving billing details",
                description: "Your billing information will be updated.",
                action: async () => {
                  formMethods.handleSubmit(submitSettings)();
                  close();
                },
              });
            }}
          >
            Done
          </Button>
        </div>

        {/* CONTENT */}
        <div
          className="px-4 space-y-4 overflow-y-auto max-h-[85vh]
          [&::-webkit-scrollbar]:w-1 
          [&::-webkit-scrollbar-track]:rounded-full 
          [&::-webkit-scrollbar-track]:bg-gray-900/20 
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-500/30"
        >
          {/* BANK ACCOUNTS */}
          <div>
            {isStripeLoading ? (
              <div>
                <h3 className="text-white text-lg font-semibold mb-3">
                  Bank Accounts
                </h3>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-white/50 text-sm">Loading bank accounts...</span>
                </div>
              </div>
            ) : !stripeAccountInfo?.data?.id ? (
              <div>
                <h3 className="text-white text-lg font-semibold mb-3">
                  Connect Payout Settings
                </h3>
                <Button
                  size="rg"
                  type="submit"
                  onClick={(e) => handleConnectStripe(e)}
                  className="w-full font-medium active:scale-95 transition-all"
                  variant="white"
                >
                  Stripe Connect
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-white text-lg font-semibold mb-3">
                  Bank Accounts
                </h3>

                <div className="space-y-3">
                  {bankAccounts.length > 0 ? (
                    bankAccounts.map((account: StripeExternalAccount) => (
                      <div key={account.id} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <p className="text-[12px]">
                          <span className="font-medium text-white">{account.bank_name}</span>
                        </p>
                        <p className="text-[12px]">
                          <span className="text-[#58CC5A]">XXXXXXXX {account.last4}</span>
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/50 text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      No bank accounts connected.
                    </div>
                  )}
                  <Button
                    size="rg"
                    type="submit"
                    onClick={(e) => handleConnectStripe(e)}
                    className="w-full font-medium active:scale-95 transition-all"
                    variant="white"
                  >
                    Stripe Connect
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* INVOICING */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">Invoicing</h3>

            <Controller
              control={formMethods.control}
              name="generateInvoices"
              render={({ field }) => (
                <Switch
                  name="generateInvoices"
                  label="Generate custom invoices"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* BILLING INFO */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">
              Billing Information
            </h3>

            <div className="space-y-3">
              <Input
                placeholder="Billing name"
                register={formMethods.register}
                registerOptions="billingName"
                errors={formMethods.formState.errors}
                autoFocus={true}
                maxLength={51}
                disabled={!isInvoiceEnabled}
              />

              <Input
                placeholder="First line of address"
                register={formMethods.register}
                registerOptions="address1"
                errors={formMethods.formState.errors}
                maxLength={301}
                disabled={!isInvoiceEnabled}
              />

              <Input
                placeholder="Second line of address"
                register={formMethods.register}
                registerOptions="address2"
                errors={formMethods.formState.errors}
                maxLength={301}
                disabled={!isInvoiceEnabled}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Postcode"
                  register={formMethods.register}
                  registerOptions="postcode"
                  errors={formMethods.formState.errors}
                  maxLength={13}
                  disabled={!isInvoiceEnabled}
                />

                <Input
                  placeholder="City"
                  register={formMethods.register}
                  registerOptions="city"
                  errors={formMethods.formState.errors}
                  maxLength={51}
                  disabled={!isInvoiceEnabled}
                />
              </div>

              <Input
                placeholder="VAT number"
                register={formMethods.register}
                registerOptions="vatNumber"
                errors={formMethods.formState.errors}
                maxLength={21}
                disabled={!isInvoiceEnabled}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

