import { createAction, Dispatch } from "@reduxjs/toolkit";
import { getRoomID, searchRoom } from "../../service/auth";
import { TRoomId, TMetadata, TJoinRoom } from "../../types/api";

export const getRoomIdLoading = createAction("GET_ROOMID_LOADING");
export const getRoomIdSuccess =
  createAction<{ roomCode: TRoomId }>("GET_ROOMID_SUCCESS");
export const getRoomIdFaliure = createAction("GET_ROOMID_FALIURE");

export const setMetaData = createAction<{ data: TMetadata }>("SET_METADATA");

export const getJoinLoading = createAction("GET_JOIN_LOAING");
export const getJoinSuccess =
  createAction<{ data: TJoinRoom }>("GET_JOIN_SUCCESS");
export const getJoinFailure = createAction("GET_JOIN_FAILURE");

export const setResetRoom = createAction("SET_RESET_ROOM");

export const getRoomId = () => async (dispatch: Dispatch) => {
  dispatch(getRoomIdLoading());

  try {
    const roomCode = await getRoomID();
    console.log(roomCode);
    dispatch(getRoomIdSuccess({ roomCode }));
  } catch {
    dispatch(getRoomIdFaliure());
  }
};

export const joinUser = (code: TRoomId) => async (dispatch: Dispatch) => {
  dispatch(getRoomIdLoading());
  try {
    const data = await searchRoom(code);
    console.log(data, "방 입장가능 메시지");
    dispatch(getJoinSuccess({ data }));
  } catch {
    dispatch(getJoinFailure());
  }
};
