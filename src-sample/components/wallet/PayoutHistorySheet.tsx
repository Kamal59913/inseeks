"use client";

import walletService from "@/services/walletService";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ToastService } from "@/lib/utilities/toastService";
import { useEffect, useState } from "react";
import Button from "../ui/button/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PayoutHistorySheet = ({ isOpen, onClose }: Props) => {
  const [selectedRange, setSelectedRange] = useState<"1" | "3" | "12">("1");

  const [stats, setStats] = useState<{
    lastMonth?: number;
    last3Months?: number;
    last12Months?: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  // Fetch payout stats when sheet opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchStats = async () => {
      setLoading(true);
      const result: any = await walletService.getPayoutStats();
      if (result?.status === 200) {
        setStats(result?.data);
      } else {
        if (result?.status !== 401) {
          ToastService.error(
            result?.data?.message ||
              "We were unable to fetch the transactions data."
          );
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, [isOpen]);

  const computeAmount = () => {
    if (!stats) return null;

    switch (selectedRange) {
      case "1":
        return stats.lastMonth ?? null;
      case "3":
        return stats.last3Months ?? null;
      case "12":
        return stats.last12Months ?? null;
      default:
        return null;
    }
  };

  const activeAmount = computeAmount();

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="bottom"
        className="sheet-gradient-bg border-none pb-12 overflow-y-auto scrollbar-hide"
      >
        {/* CLOSE BUTTON */}
        <div className="flex items-center justify-end p-4 h-full">
          <img
            src="/xIcon.svg"
            className="cursor-pointer w-5 h-5"
            onClick={onClose}
          />
        </div>

        <div className="px-6 pb-6 text-white text-center">
          {/* TITLE */}
          <h2 className="text-lg font-semibold mb-4">Payout History</h2>

          {/* RANGE SELECTOR */}
          <div className="flex justify-center gap-3 mb-6">
            {[
              { label: "Last month", value: "1" },
              { label: "3 months", value: "3" },
              { label: "12 months", value: "12" },
            ].map((item) => {
              const isActive = selectedRange === item.value;

              return (
                <Button
                  key={item.value}
                  variant={isActive ? "white" : "glass"}
                  size="sm"
                  borderRadius="rounded-[12px]"
                  shadow={
                    isActive
                      ? undefined
                      : "shadow-[inset_0_4px_4px_0_rgba(210,210,210,0.25)]"
                  }
                  blur={isActive ? undefined : "backdrop-blur-[94px]"}
                  onClick={() => setSelectedRange(item.value as any)}
                  className={`h-[34px] leading-none whitespace-nowrap font-medium`}
                >
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* PAYOUT AMOUNT */}
          {loading ? (
            <h1 className="text-lg text-gray-300">Loading...</h1>
          ) : activeAmount === null ? (
            <h1 className="text-lg text-gray-300">No data found</h1>
          ) : (
            <h1 className="text-5xl font-bold">
              £
              {activeAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h1>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PayoutHistorySheet;

