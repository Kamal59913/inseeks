import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import {
  startButtonLoading,
  stopButtonLoading,
} from "@/store/slices/globalSlice";
import { handleError } from "@/lib/utilities/handleAuth";

const addressService = {
  getAutocomplete: async (keyword: string) => {
    store.dispatch(startButtonLoading("address-autocomplete"));

    try {
      const response = await apiClient.get("/address/autocomplete", {
        skipAuthRedirect: true,
        params: { keyword },
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("address-autocomplete"));
    }
  },

  // FULL ADDRESS LOOKUP
  getFullAddress: async (id: string) => {
    store.dispatch(startButtonLoading("address-get"));

    try {
      const response = await apiClient.get(`/address/get/${id}`, {
        skipAuthRedirect: true,
      });
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("address-get"));
    }
  },
};

export default addressService;

