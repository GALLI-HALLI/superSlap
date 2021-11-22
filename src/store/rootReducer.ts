import { combineReducers } from "@reduxjs/toolkit";
import user from "./user/user.reducer";
import room from "./room/room.reducer";

const rootReducer = combineReducers({
  user,
  room,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
