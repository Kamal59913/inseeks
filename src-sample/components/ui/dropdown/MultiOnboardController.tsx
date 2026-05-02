import React from "react";
import { Home, Building2, Users } from "lucide-react";

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface MultiOnBoardProps {
  title?: string;
  subtitle?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  errorMessage?: { message?: string };
  version?: string;
  showCheckbox?: boolean;
  maxHeight?: string;
}

const ShowIf = ({ condition, children }: { condition: boolean; children: React.ReactNode }) => {
  return condition ? <>{children}</> : null;
};

export const MultiOnBoard: React.FC<MultiOnBoardProps> = ({
  subtitle = "",
  options,
  value = [],
  onChange,
  errorMessage,
  version = "v1",
  showCheckbox = false,
  maxHeight,
}) => {
  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <ShowIf condition={version === "v1"}>
          <p className="text-sm text-gray-400 text-center">{subtitle}</p>
        </ShowIf>
      </div>

      <div 
        className="space-y-3 overflow-y-auto"
        style={maxHeight ? { maxHeight } : undefined}
      >
        {options.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <div key={option.value} className="flex items-center gap-3">
              {showCheckbox && (
                <div
                  onClick={() => toggleOption(option.value)}
                  className="cursor-pointer"
                >
                  <div
                    className={`
                      shrink-0 w-6 h-6 rounded flex items-center justify-center transition-all
                      ${
                        isSelected
                          ? "bg-white"
                          : "bg-transparent border-2 border-gray-600"
                      }
                    `}
                  >
                    {isSelected && (
                      <svg
                        width="14"
                        height="11"
                        viewBox="0 0 14 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5.5L5 9.5L13 1.5"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              )}
              <div
                onClick={() => toggleOption(option.value)}
                className={`
                  flex-1 relative rounded-xl p-4 cursor-pointer transition-all duration-200 bg-white/5
                  ${
                    isSelected
                      ? "border-2 border-white"
                      : "border-2 border-transparent hover:border-white/50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                  `}
                  >
                    {option.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium">
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
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <p className="mt-3 text-sm text-red-400">{errorMessage?.message}</p>
      )}
    </div>
  );
};

