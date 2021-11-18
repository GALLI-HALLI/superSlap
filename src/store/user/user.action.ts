import { createAction, Dispatch } from "@reduxjs/toolkit";
import { getCurrentUserProfile, signUpUser } from "../../service/auth";
import { TProfile, TRegister } from "../../types/api";

export const registerLoading = createAction("REGISTER_LOADING");
export const registerSuccess = createAction("REGISTER_SUCCESS");
export const registerFailure = createAction("REGISTER_FAILURE");

// 서버에서 응답하는 데이터 의미있는 값이 아닐때가 있음..

export const getProfileLoading = createAction("GET_PROFILE_LOADING");
export const getProfileSuccess = createAction<{ profile: TProfile }>(
  "GET_PROFILE_SUCCESS",
);
export const getProfileFailure = createAction("GET_PROFILE_FAILURE");

export const getProfile = () => async (dispatch: Dispatch) => {
  dispatch(getProfileLoading());
  try {
    const profile = await getCurrentUserProfile();
    dispatch(getProfileSuccess({ profile }));
  } catch {
    dispatch(getProfileFailure());
  }
};

export const registerUser =
  ({ id, name, password }: TRegister) =>
  async (dispatch: Dispatch) => {
    dispatch(registerLoading());
    try {
      const token = await signUpUser({ id, name, password });
      localStorage.setItem("token", token.token);
      dispatch(registerSuccess());
    } catch {
      dispatch(registerFailure());
    }
  };
