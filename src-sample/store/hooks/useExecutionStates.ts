// import { useSelector, useDispatch } from "react-redux";
// import {   setInitialOrder,
//   reorderImages,
//   markOrderAsSaved,
//   triggerSave,
//   resetOrder, } from "../slices/executionSlice";
// import { AppDispatch, RootState } from "../store";

// export const usePhotoOrder = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const state = useSelector((s: RootState) => s.photoOrder);

//   return {
//     orderedImageIds: state.orderedImageIds,
//     hasUnsavedChanges: state.hasUnsavedChanges,
//     saveTrigger: state.saveTrigger,

//     // actions exposed
//     setInitialOrder: (ids: string[]) => dispatch(setInitialOrder(ids)),
//     reorderImages: (ids: string[]) => dispatch(reorderImages(ids)),
//     markOrderAsSaved: () => dispatch(markOrderAsSaved()),
//     triggerSave: () => dispatch(triggerSave()),
//     resetOrder: () => dispatch(resetOrder()),
//   };
// };

