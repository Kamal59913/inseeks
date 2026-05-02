"use client";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import Loader from "../ui/loader/loader";

export const LoaderLayout = () => {
  const { pageloading } = useGlobalStates();
  return <>{pageloading && <Loader />}</>;
};

