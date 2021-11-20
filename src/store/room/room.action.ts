import { createAction, Dispatch } from "@reduxjs/toolkit";
import { getRoomID } from "../../service/auth";
import { TRoomId } from "../../types/api";

export const getRoomIdLoading = createAction("GET_ROOMID_LOADING");
export const getRoomIdSuccess =
  createAction<{ roomCode: TRoomId }>("GET_ROOMID_SUCCESS");
export const getRoomIdFaliure = createAction("GET_ROOMID_FALIURE");

export const getRoomId = () => async (dispatch: Dispatch) => {
  dispatch(getRoomIdLoading());

  try {
    const roomCode = await getRoomID();
    dispatch(getRoomIdSuccess({ roomCode }));
  } catch {
    dispatch(getRoomIdFaliure());
  }
};
