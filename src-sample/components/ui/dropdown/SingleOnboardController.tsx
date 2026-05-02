import React from "react";
import { FieldError, Merge } from "react-hook-form";
import { ShowIf } from "@/lib/utilities/showIf";
import Button from "@/components/ui/button/Button";

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

type SingleOnBoardVariant = "list" | "pills" | "block" | "card";

interface SingleOnBoardProps {
  title?: string;
  subtitle?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  errorMessage?: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  variant?: SingleOnBoardVariant;
}

export const SingleOnBoard: React.FC<SingleOnBoardProps> = ({
  title,
  subtitle,
  options,
  value,
  onChange,
  errorMessage,
  variant = "list",
}) => {
  const selectOption = (optionValue: string) => {
    // For single select, we always set the new value.
    // Toggling off logic can be complex in single select if mandatory,
    // assuming standard radio-like behavior where one must be selected usually,
    // or if optional, deselecting allowed.
    // Based on previous code:
    // V1: newValue = value === optionValue ? "" : optionValue; (Toggleable)
    // V2: newValue = value === optionValue ? "" : optionValue; (Toggleable)
    // V3: value.includes(optionValue) ? [] : [optionValue]; (Toggleable)
    // Preserving toggle-off behavior for consistency.
    const newValue = value === optionValue ? "" : optionValue;
    onChange(newValue);
  };

  /**
   * Render List Variant (Original SingleOnBoard)
   * Vertical scrollable list
   */
  const renderList = () => (
    <div className="w-full max-w-md mt-6">
      <div
        className="space-y-3 max-h-96 overflow-y-auto  [&::-webkit-scrollbar]:w-1
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pr-2"
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <div
              key={option.value}
              onClick={() => selectOption(option.value)}
              className={`
                relative rounded-xl p-4 cursor-pointer transition-all duration-200 bg-white/5
                ${
                  isSelected
                    ? "border-2 border-white"
                    : "border-2 border-transparent hover:border-white/50"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1">
                    {option.label}
                  </h3>
                  {option.description && (
                    <p className="text-sm text-gray-400">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /**
   * Render Pills Variant (Original SingleOnBoardV2)
   * Horizontal row of pills
   */
  const renderPills = () => (
    <div
      className="w-full max-w-md mt-2 max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 pb-2"
    >
      <div className="flex flex-row gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <Button
              key={option.value}
              variant={isSelected ? "white" : "glass"}
              size="sm"
              borderRadius="rounded-[10px]"
              shadow={
                isSelected
                  ? undefined
                  : "shadow-[inset_0_4px_4px_0_rgba(210,210,210,0.25)]"
              }
              blur={isSelected ? undefined : "backdrop-blur-[94px]"}
              onClick={(e) => {
                e.preventDefault();
                selectOption(option.value);
              }}
              className={`h-[34px] leading-none whitespace-nowrap font-medium`}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );

  /**
   * Render Block Variant (Original SingleOnBoardV3 Horizontal)
   * Horizontal buttons with icons
   */
  const renderBlock = () => (
    <div className="w-full">
      <ShowIf condition={!!subtitle}>
        <p className="text-sm text-gray-400 text-center mb-4">{subtitle}</p>
      </ShowIf>

      <div className="flex gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <Button
              key={option.value}
              variant={isSelected ? "primary" : "glass"}
              size="none"
              borderRadius="rounded-[12px]"
              shadow={
                isSelected
                  ? undefined
                  : "shadow-[inset_0_4px_4px_0_rgba(210,210,210,0.25)]"
              }
              blur={isSelected ? undefined : "backdrop-blur-[94px]"}
              onClick={(e) => {
                e.preventDefault();
                selectOption(option.value);
              }}
              className="w-1/3 px-3 py-4 text-[11px] text-left leading-4 transition-all duration-200"
            >
              <div className="w-auto h-[14px] mb-3 flex items-center">
                {option.icon}
              </div>
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );

  /**
   * Render Card Variant (Original SingleOnBoardV3 Vertical)
   * Vertical cards with icons
   */
  const renderCard = () => (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <ShowIf condition={!!subtitle}>
          <p className="text-sm text-gray-400 text-center">{subtitle}</p>
        </ShowIf>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <div
              key={option.value}
              onClick={(e) => {
                e.preventDefault();
                selectOption(option.value);
              }}
              className={`
                relative rounded-xl p-4 cursor-pointer transition-all duration-200 bg-white/5
                ${
                  isSelected
                    ? "border-2 border-white"
                    : "border-2 border-transparent hover:border-white/50"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                  `}
                >
                  {option.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium mb-1">
                    {option.label}
                  </h3>
                  {option.description && (
                    <p className="text-sm text-gray-400">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {variant === "list" && renderList()}
      {variant === "pills" && renderPills()}
      {variant === "block" && renderBlock()}
      {variant === "card" && renderCard()}

      {/* Error Message */}
      {errorMessage && (
        <p className="mt-2 text-sm text-red-400">{errorMessage?.message}</p>
      )}
    </>
  );
};

