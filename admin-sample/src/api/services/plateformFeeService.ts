import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import {
  startButtonLoading,
  stopButtonLoading,
} from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { queryClient } from "@/utils/queryClient";
import { fetchCurrentUser } from "@/redux/authThunk";

const platformFeeService = {
  getFreelancerPlatformFee: async (freelancerId: string) => {
    store.dispatch(startButtonLoading("get-freelancer-platform-fee"));

    try {
      const response = await apiClient.get(
        `/admin/freelancers/${freelancerId}/platform-fee`
      );

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("get-freelancer-platform-fee"));
    }
  },

  updateGlobalFee: async (data: any) => {
    store.dispatch(startButtonLoading("update-global-platform-fee"));

    try {
      const payload = {
        platform_fee: Number(data.plateformFee) || 0,
      };
      const response = await apiClient.post(
        `/admin/platform-fee/global`,
        payload
      );

      await store.dispatch(fetchCurrentUser());

      // await queryClient.invalidateQueries({
      //   queryKey: ["get-freelancers-plateform-fee-byId"],
      //   exact: false,
      // });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("update-global-platform-fee"));
    }
  },

  updateFreelancerFee: async (freelancerId: string, data: any) => {
    store.dispatch(startButtonLoading("update-freelancer-platform-fee"));

    try {
      const payload = {
        platform_fee: Number(data.plateformFee) || 0,
      };

      const response = await apiClient.post(
        `/admin/freelancers/${freelancerId}/platform-fee`,
        payload
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancers-plateform-fee-byId"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("update-freelancer-platform-fee"));
    }
  },
};

export default platformFeeService;
