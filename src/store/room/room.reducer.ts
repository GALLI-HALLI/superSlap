import {
  getRoomIdFaliure,
  getRoomIdSuccess,
  getRoomIdLoading,
  setMetaData,
} from "./room.action";
import { TRoomId, TMetadata } from "../../types/api";
import { AsyncActionStatus } from "../../constants/redux";
import { createReducer } from "@reduxjs/toolkit";

type TRoom = {
  roomId: {
    roomData?: TRoomId;
    roomStatus: AsyncActionStatus;
  };
  metadata?: TMetadata;
};

const initialState: TRoom = {
  roomId: {
    roomStatus: AsyncActionStatus.Idle,
  },
  metadata: undefined,
};

const room = createReducer(initialState, (builder) => {
  builder.addCase(getRoomIdLoading, (state) => {
    state.roomId.roomStatus = AsyncActionStatus.Loading;
  });
  builder.addCase(getRoomIdSuccess, (state, action) => {
    const { roomCode } = action.payload;
    state.roomId.roomData = roomCode;
    state.roomId.roomStatus = AsyncActionStatus.Success;
  });
  builder.addCase(getRoomIdFaliure, (state) => {
    state.roomId.roomStatus = AsyncActionStatus.Failure;
  });

  builder.addCase(setMetaData, (state, { payload: { data } }) => {
    state.metadata = data;
  });
});

export default room;
