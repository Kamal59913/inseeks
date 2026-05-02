
interface UserMetricesProps {
  data: any;
}

const UserMetrics: React.FC<UserMetricesProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 md:gap-6 mt-6">
      {data?.map((data: any, index: number) => {
        return (
<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6" key={index}>
          {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-black"> */}
            {/* <GroupIcon className="text-black size-6 dark:text-white/90" /> */}
            {/* {data} */}
            <div className="flex justify-between  text-black dark:text-white/90 break-words">
             {data?.country} 
             <span>
             {data?.emoji}
             </span>
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 black-text">
                Users
              </span>
              <h4 className="mt-2 font-bold text-black text-title-sm dark:text-white/90">
                {data?.userCount}
              </h4>
            </div>
            {/* <Badge color="success"> */}
            {data?.code}
              {/* <ArrowUpIcon /> */}
           {/* </Badge> */}
          </div>
        </div>
        )
        
      })}
    </div>
  );
};

export default UserMetrics;
