import { GameType, GameStatus } from "../constants/game";

export type TProfile = {
  id: string;
  name: string;
};

export type TRegister = {
  id: string;
  name: string;
  password: string;
};

export type TLogin = {
  id: string;
  password: string;
};

export type TRoomId = {
  roomId: string;
};

export type TJoinRoom = {
  msg: string;
  succuess: boolean;
};

export type TPlayer = {
  id: string;
  nickname: string;
};

export type TMetadata = {
  id: string;
  code: string;
  players: Record<string, TPlayer>;
  type: GameType;
  gameStatus: GameStatus;
  startTime: string;
  loser?: TPlayer;
};
