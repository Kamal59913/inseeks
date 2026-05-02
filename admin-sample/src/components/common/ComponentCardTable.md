<!-- import Button from "../ui/button/Button";
import { useModalData } from "../../redux/hooks/useModal";
interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  data?: any;
  tableName?: string
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  data,
  tableName = "",
}) => {
  const { open } = useModalData();
  return (
    <>
      {tableName === "users" && (
        <div
          className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
        >
          {/* Card Header */}
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-black dark:text-white/90">
              {title}
            </h3>
            {desc && (
              <p className="mt-1 text-sm text-gray-500 black-text">
                {desc}
              </p>
            )}
          </div>
          {/* Card Body */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      )}
      {tableName === "categories" && (
        <div
          className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] pt-4 ${className}`}
        >
          <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white/90">
                Recent Orders
              </h3>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <form>
                <div className="relative">
                  <span className="absolute -translate-y-1/2 pointer-events-none top-1/2 left-4">
                    <svg
                      className="fill-gray-500 dark:fill-gray-400"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
                        fill=""
                      ></path>
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="dark:bg-dark-900  focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-[42px] text-sm text-black placeholder:text-gray-400  focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-black dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>
              </form>
              <div>
                <button className="text-theme-sm  inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-black dark:border-gray-700 dark:bg-black black-text dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                  <svg
                    className="stroke-current fill-white dark:fill-black"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.29004 5.90393H17.7067"
                      stroke=""
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M17.7075 14.0961H2.29085"
                      stroke=""
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                      fill=""
                      stroke=""
                      stroke-width="1.5"
                    ></path>
                    <path
                      d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                      fill=""
                      stroke=""
                      stroke-width="1.5"
                    ></path>
                  </svg>
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-6">{children}</div>
          </div>
        </div>
      )}
      {tableName === "categories" && (
        <>
          <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] pt-4 ${className}`}
          >
            <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white/90">
                  {title}
                </h3>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div>
                  <Button
                    onClick={() => {
                      open("add-category", data);
                    }}
                  >
                    Add Category
                  </Button>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-6">{children}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ComponentCard; -->
