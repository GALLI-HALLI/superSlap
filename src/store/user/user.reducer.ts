import { createReducer } from "@reduxjs/toolkit";
import {
  getProfileLoading,
  getProfileSuccess,
  getProfileFailure,
  registerLoading,
  registerSuccess,
  registerFailure,
} from "../user/user.action";
import { TProfile } from "../../types/api";
import { AsyncActionStatus } from "../../constants/redux";

type TUserStore = {
  profile: {
    data?: TProfile;
    status: AsyncActionStatus;
  };
  register: {
    status: AsyncActionStatus;
  };
};

const initialState: TUserStore = {
  profile: {
    status: AsyncActionStatus.Idle,
  },
  register: {
    status: AsyncActionStatus.Idle,
  },
};

const user = createReducer(initialState, (builder) => {
  builder.addCase(getProfileLoading, (state) => {
    state.profile.status = AsyncActionStatus.Loading;
  });
  builder.addCase(getProfileSuccess, (state, action) => {
    const { profile } = action.payload;
    state.profile.data = profile;
    state.profile.status = AsyncActionStatus.Success;
  });
  builder.addCase(getProfileFailure, (state) => {
    state.profile.status = AsyncActionStatus.Failure;
  });

  builder.addCase(registerLoading, (state) => {
    state.register.status = AsyncActionStatus.Loading;
  });
  builder.addCase(registerSuccess, (state) => {
    state.register.status = AsyncActionStatus.Success;
  });
  builder.addCase(registerFailure, (state) => {
    state.register.status = AsyncActionStatus.Failure;
  });
});

export default user;
