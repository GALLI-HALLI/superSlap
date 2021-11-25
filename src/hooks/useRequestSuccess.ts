import { AsyncActionStatus } from "../constants/redux";
import usePrevious from "./usePrevious";

const useRequestSuccess = (status: AsyncActionStatus) => {
  const previousStatus = usePrevious(status);
  return (
    previousStatus === AsyncActionStatus.Loading &&
    status === AsyncActionStatus.Success
  );
};

export default useRequestSuccess;
