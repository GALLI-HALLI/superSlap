import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "./typeReduxHook";
import { useHistory } from "react-router";
import { getProfile } from "../store/user/user.action";
import { AsyncActionStatus } from "../constants/redux";

const useProfile = (option?: { blockAccess?: boolean }) => {
  const { blockAccess } = option ?? {};
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    profile: { data, status },
    loginStatus,
    registerStatus,
  } = useSelector((store) => ({
    profile: store.user.profile,
    loginStatus: store.user.login.status,
    registerStatus: store.user.register.status,
  }));

  useEffect(() => {
    !data && dispatch(getProfile());
  }, []);

  useEffect(() => {
    if ([loginStatus, registerStatus].includes(AsyncActionStatus.Success)) {
      dispatch(getProfile());
    }
  }, [loginStatus, registerStatus, dispatch]);

  useEffect(() => {
    if (AsyncActionStatus.Failure === status && !data && blockAccess) {
      history.replace("/");
    }
  }, [data, status, history, blockAccess]);

  return { data, status };
};

export default useProfile;
