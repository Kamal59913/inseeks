import BounceLoader from "react-spinners/BounceLoader";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-[#1f002c] opacity-60 z-10000">
      <div className="text-gray-900 dark:text-gray-100">
        <BounceLoader color="currentColor" size={80} />
      </div>
    </div>
  );
};

export default Loader;

