import { useGlobalStates } from '../../../redux/hooks/useGlobalStates';
import Loader from '../../ui/loader/loader';

export const PageLoader = () => {
const {pageloading} = useGlobalStates()
  return (
    <>
      {pageloading && (
        <Loader/>
      )}
    </>
  );
};