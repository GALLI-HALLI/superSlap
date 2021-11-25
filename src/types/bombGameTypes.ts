//게임
export type TPlayerBall = {
  id: string;
  color: string;
  x: number;
  y: number;
  bomb: boolean;
};

export type TDataToServer = {
  id: string;
  x: number;
  y: number;
};

export type TGameCanvas = {
  height: number;
  width: number;
};

export type TGameIntialData = {
  ballRad: number;
  ballMoveSpeed: number;
  bombMoveSpeed: number;
  maxPlayTime: number;
  bombFreezeTime: number;
};

export type TTimerData = {
  progressBarHeight: number;
};

export type TGameOngoingData = {
  gameTime: number;
  gameEnded: boolean;
  myBombChangeFreeze: boolean;
  otherBombChangeFreeze: boolean;
};

export type TBombFlick = {
  x: number;
  a: number;
  frameCnt: number;
  period: number;
};

export type TImages = {
  bombIm: HTMLImageElement;
  gameBackgroundIm: HTMLImageElement;
  explosionIm: HTMLImageElement;
};

//조이스틱 조작
export type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

export interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
}

export type TJoystickData = {
  moveX: number;
  moveY: number;
  state: "move" | "stop" | "start";
};
