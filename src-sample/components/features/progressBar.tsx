import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  progressClassName?: string;
}

export const StepProgress = ({
  currentStep,
  totalSteps,
  className,
  progressClassName,
}: StepProgressProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn(className)}>
        {/* Progress Bar */}
        <Progress
          value={progressPercentage}
          className={cn(
            "[&>div]:bg-black dark:[&>div]:bg-white flex-1 h-px w-40 sm:w-[266px] rounded-lg bg-tab-hover",
            progressClassName
          )}
        />
      </div>
  );
};

