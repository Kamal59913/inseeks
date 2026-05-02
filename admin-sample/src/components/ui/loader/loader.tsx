import BounceLoader from "react-spinners/BounceLoader";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black bg-opacity-50 z-[100000]">
      <div className="text-black dark:text-gray-100">
        <BounceLoader color="currentColor" size={80}/>
      </div>
    </div>
  );
};

export default Loader;