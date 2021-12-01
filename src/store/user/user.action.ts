import { createAction, Dispatch } from "@reduxjs/toolkit";
import {
  getCurrentUserProfile,
  signUpUser,
  loginUser,
} from "../../service/auth";
import { TProfile, TRegister, TLogin } from "../../types/api";

export const registerLoading = createAction("REGISTER_LOADING");
export const registerSuccess = createAction("REGISTER_SUCCESS");
export const registerFailure = createAction("REGISTER_FAILURE");

export const loginLoading = createAction("LOGIN_LOADING");
export const loginSuccess = createAction("LOGIN_SUCCESS");
export const loginFailure = createAction("LOGIN_FAILURE");

export const resetProfile = createAction("RESET_PROFILE");

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
      const { token } = await signUpUser({ id, name, password });
      localStorage.setItem("token", token);
      dispatch(registerSuccess());
    } catch {
      dispatch(registerFailure());
    }
  };

export const userLogin =
  ({ id, password }: TLogin) =>
  async (dispatch: Dispatch) => {
    dispatch(loginLoading());
    try {
      const { token } = await loginUser({ id, password });
      if (token) {
        localStorage.setItem("token", token);
        dispatch(loginSuccess());
      } else {
        alert("아이디와 비밀번호를 다시 확인해 주세요");
      }
    } catch {
      dispatch(loginFailure());
    }
  };
