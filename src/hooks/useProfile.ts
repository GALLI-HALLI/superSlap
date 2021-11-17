import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { RootState } from "../store/rootReducer";
import { getProfile } from "../store/user/user.action";
import { AsyncActionStatus } from "../constants/redux";

const useProfile = (option?: { blockAccess?: boolean }) => {
  const { blockAccess } = option ?? {};
  const history = useHistory();
  const dispatch = useDispatch();
  const { data, status } = useSelector(
    (store: RootState) => store.user.profile,
  );

  useEffect(() => {
    !data && dispatch(getProfile());
  }, []);

  useEffect(() => {
    if (AsyncActionStatus.Failure === status && blockAccess) {
      history.replace("/");
    }
  }, [data, status, history, blockAccess]);

  return { data, status };
};

export default useProfile;
