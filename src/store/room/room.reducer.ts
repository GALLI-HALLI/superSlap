import {
  getRoomIdFaliure,
  getRoomIdSuccess,
  getRoomIdLoading,
  setMetaData,
  getJoinFailure,
  getJoinLoading,
  getJoinSuccess,
  setResetRoom,
} from "./room.action";
import { TRoomId, TMetadata, TJoinRoom } from "../../types/api";
import { AsyncActionStatus } from "../../constants/redux";
import { createReducer } from "@reduxjs/toolkit";

type TRoom = {
  roomId: {
    roomData?: TRoomId;
    roomStatus: AsyncActionStatus;
  };
  metadata?: TMetadata;
  joinRoom: {
    message?: TJoinRoom;
    joinStatus: AsyncActionStatus;
  };
};

const initialState: TRoom = {
  roomId: {
    roomStatus: AsyncActionStatus.Idle,
  },
  metadata: undefined,
  joinRoom: {
    joinStatus: AsyncActionStatus.Idle,
  },
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

  builder.addCase(getJoinLoading, (state) => {
    state.joinRoom.joinStatus = AsyncActionStatus.Loading;
  });
  builder.addCase(getJoinSuccess, (state, action) => {
    const { data } = action.payload;
    state.joinRoom.message = data;
    state.joinRoom.joinStatus = AsyncActionStatus.Success;
  });
  builder.addCase(getJoinFailure, (state) => {
    state.joinRoom.joinStatus = AsyncActionStatus.Failure;
  });

  builder.addCase(setResetRoom, (state) => {
    return initialState;
  });
});

export default room;
