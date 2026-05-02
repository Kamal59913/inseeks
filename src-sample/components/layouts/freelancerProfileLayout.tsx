"use client";

interface FreeLancerProfileLayoutProps {
  children: React.ReactNode;
}

const FreeLancerProfileLayout: React.FC<FreeLancerProfileLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-y-scroll hide-scrollbar main-wrapper">
      <div
        className={`w-full md:max-w-[393px] shadow-2xl h-screen text-gray-700 dark:text-white z-100`}
      >
        <div className="h-full flex flex-col">
          <div className={`flex-1 flex flex-col relative`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FreeLancerProfileLayout;

