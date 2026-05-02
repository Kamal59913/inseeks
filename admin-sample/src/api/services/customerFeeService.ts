import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import {
  startButtonLoading,
  stopButtonLoading,
} from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { fetchCurrentUser } from "@/redux/authThunk";

const customerFeeService = {
  updateCustomerFee: async (data: any) => {
    store.dispatch(startButtonLoading("update-global-customer-fee"));

    try {
      const payload = {
        customer_fee: Number(data.customerFee) || 0,
      };
      const response = await apiClient.post(
        `/admin/customer-fee/global`,
        payload
      );

      await store.dispatch(fetchCurrentUser());

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("update-global-customer-fee"));
    }
  },
};

export default customerFeeService;
