import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { 
  setLoading, 
  setPageLoading, 
  startButtonLoading, 
  stopButtonLoading, 
  resetButtonLoading, 
  startAction,
  stopAction,
  resetAction
} from "../slices/globalSlice";

export const useGlobalStates = () => {
  const globalState = useSelector((state: RootState) => state.global);
  const dispatch: AppDispatch = useDispatch();

  return {
    loading: globalState.loading,
    setLoading: (value: boolean) => dispatch(setLoading(value)),
    pageloading: globalState.pageloading,
    setPageLoading: (value: boolean) => dispatch(setPageLoading(value)),
    isButtonLoading: (id: string) => !!globalState.buttonLoaders?.[id], // ✅ Access via globalState
    startButtonLoading: (id: string) => dispatch(startButtonLoading(id)),
    stopButtonLoading: (id: string) => dispatch(stopButtonLoading(id)),
    resetButtonLoading: (id: string) => dispatch(resetButtonLoading(id)),

    isAction: (id: string) => !!globalState.action?.[id], // ✅ Access via globalState
    startAction: (id: string) => dispatch(startAction(id)),
    stopAction: (id: string) => dispatch(stopAction(id)),
    resetAction: (id: string) => dispatch(resetAction(id)),
  };
};