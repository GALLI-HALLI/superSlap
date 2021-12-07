import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { Joystick } from "react-joystick-component";
import { Socket } from "socket.io-client";
import { SocketServerEvent } from "../../constants/socket";
import "./BombGame.scss";

//게임 로직
import {
  adjustPosition,
  isBallCollision,
  isWallCollision,
} from "../../utils/bombGameLogic";

// 이미지
import bombImage from "../../image/bomb.png";
import backgroundImage from "../../image/gameBackground.jpg";
import explosionImage from "../../image/explosion.png";
import electricImage from "../../image/electric.png";
import monsterImg1 from "../../image/monsters/monster1.png";
import monsterImg2 from "../../image/monsters/monster2.png";
import monsterImg3 from "../../image/monsters/monster3.png";
import monsterImg4 from "../../image/monsters/monster4.png";
import monsterImg5 from "../../image/monsters/monster5.png";
import monsterImg6 from "../../image/monsters/monster6.png";
import monsterImg7 from "../../image/monsters/monster7.png";
import monsterImg8 from "../../image/monsters/monster8.png";

//튜토리얼
import GameTutorial from "./GameTutorial";

//게임 시작 애니메이션
//총 3.7초 3700
import {
  drawGameStart,
  gameStartAnimation,
} from "../../utils/gameStartAnimation";

// type
import {
  TPlayerBall,
  TDataToServer,
  IJoystickUpdateEvent,
  TJoystickData,
  TGameCanvas,
  TGameIntialData,
  TGameOngoingData,
  TTimerData,
  TImages,
  TBombFlick,
} from "../../types/bombGameTypes";
import { gameEnd } from "../../server/constants/socketEvents";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { createJsxSpreadAttribute } from "typescript";

/* ================== 조이스틱 관련 시작 ================== */

const joystickData: TJoystickData = {
  moveX: 0,
  moveY: 0,
  state: "stop",
};

const handleMove = (event: IJoystickUpdateEvent) => {
  const x: number | null = event.x;
  const y: number | null = event.y;
  joystickData.state = event.type;

  if (x != null && y != null) {
    joystickData.moveX = x / 50;
    joystickData.moveY = y / -50;
  }
};

const handleStop = (event: IJoystickUpdateEvent) => {
  joystickData.state = event.type;
};

/* ================== 조이스틱 관련 끝 ================== */

/* ================== 이미지 관련 시작 ================== */

const bomb = new Image();
bomb.src = bombImage;

const gameBackground = new Image();
gameBackground.src = backgroundImage;

const explosion = new Image();
explosion.src = explosionImage;

const electric = new Image();
electric.src = electricImage;

const Images: TImages = {
  bombIm: bomb,
  gameBackgroundIm: gameBackground,
  explosionIm: explosion,
};

/* ================== 이미지 관련 끝 ================== */

/* ================== 타입 및 클래스 선언 시작================== */
class playerBall {
  id: string;
  nickname: string;
  color: string;
  x: number;
  y: number;
  bomb: boolean;

  constructor() {
    this.id = "initialId";
    this.nickname = "누구세요";
    this.color = "#FF00FF";
    this.x = 360 / 2;
    this.y = 500 / 2;
    this.bomb = false;
  }
}

/* ================== 타입 및 클래스 선언 끝================== */

/* ================== 게임 정보 관련 시작 ================== */

class BombGameData {
  gameCanvas = {
    width: 360,
    height: 500,
  };

  initialData: TGameIntialData = {
    ballRad: 20,
    ballMoveSpeed: 2, // 1 보다 큰 수로 속도 배율
    bombMoveSpeed: 3, // 폭탄은 유저보다 빠르게
    maxPlayTime: 30,
    bombFreezeTime: 1000, // 1초 = 1000
  };

  ongoingData: TGameOngoingData = {
    gameTime: 0,
    gameEnded: false,
    myBombChangeFreeze: false,
    otherBombChangeFreeze: false,
  };

  bombFlick: TBombFlick = {
    x: 0,
    a: 1,
    frameCnt: 0,
    period: 120,
  };

  balls: TPlayerBall[] = [];
  ballMap: Record<string, playerBall> = {};
  myId: string = "";

  gameEnded = false;
  gameStart = false;

  ifEnd = {
    height: -(500 + 140),
  };

  gameStartAnimation = {
    value: 0,
  };
}

//Note: 현재 픽셀 위치 설정은 canvas 360x500을 기준으로 맞춰져있습니다.
const gameCanvas: TGameCanvas = {
  width: 360,
  height: 500,
};

const initialData: TGameIntialData = {
  ballRad: 20,
  ballMoveSpeed: 4, // 1 보다 큰 수로 속도 배율
  bombMoveSpeed: 7, // 폭탄은 유저보다 빠르게
  maxPlayTime: 30,
  bombFreezeTime: 1000, // 1초 = 1000
};

const ongoingData: TGameOngoingData = {
  gameTime: 0,
  gameEnded: false,
  myBombChangeFreeze: false,
  otherBombChangeFreeze: false,
};

const timerData: TTimerData = {
  progressBarHeight: 0,
};

const bombFlick: TBombFlick = {
  x: 0,
  a: 1,
  frameCnt: 0,
  period: 180, //커질수록 천천히 깜빡임
};

// let balls: TPlayerBall[] = [];
// let ballMap: Record<string, playerBall> = {};
let myId: string;

let gameEnded = false;
let gameStart = false;

function joinUser(data: TPlayerBall[], instance: any) {
  console.log("join user");

  let balls = instance.balls;
  let ballMap = instance.ballMap;

  for (let i = 0; i < data.length; i++) {
    let ball = new playerBall();
    ball.id = data[i].id;
    ball.nickname = data[i].nickname;
    ball.color = data[i].color;
    ball.x = data[i].x;
    ball.y = data[i].y;
    ball.bomb = data[i].bomb;

    balls.push(ball);
    ballMap[data[i].id] = ball;
  }

  return;
}

function leaveUser(id: string, instance: any) {
  let balls = instance.balls;
  let ballMap = instance.ballMap;

  for (var i = 0; i < balls.length; i++) {
    if (balls[i].id === id) {
      balls.splice(i, 1);
      break;
    }
  }
  delete ballMap[id];
}

function updateState(data: TPlayerBall, instance: any) {
  let balls = instance.balls;
  let ballMap = instance.ballMap;

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].id === data.id) {
      balls[i].x = data.x;
      balls[i].y = data.y;
      balls[i].bomb = data.bomb;
      break;
    }
  }

  let ball = ballMap[data.id];
  if (!ball) {
    return;
  }
  ball.x = data.x;
  ball.y = data.y;
  ball.bomb = data.bomb;
}

function updateBomb(
  sid: string,
  sbomb: boolean,
  rid: string,
  rbomb: boolean,
  instance: any
) {
  let balls = instance.balls;
  let ballMap = instance.ballMap;

  for (let i = 0; i < balls.length; i++) {
    if (balls[i].id === sid) {
      balls[i].bomb = sbomb;
      break;
    }
    if (balls[i].id === rid) {
      balls[i].bomb = rbomb;
      break;
    }
  }

  let sball = ballMap[sid];
  let rball = ballMap[rid];

  if (!sball) {
    return;
  }
  if (!rball) {
    return;
  }

  sball.bomb = sbomb;
  rball.bomb = rbomb;

  // 내가 폭탄일 경우 5초간 조작 금지.
  if (rid === myId) {
    ongoingData.myBombChangeFreeze = true;
    setTimeout(function () {
      ongoingData.myBombChangeFreeze = false;
    }, initialData.bombFreezeTime);
  }

  ongoingData.otherBombChangeFreeze = true;
  setTimeout(function () {
    ongoingData.otherBombChangeFreeze = false;
  }, initialData.bombFreezeTime);
  //클라이언트 사이드에서 생긴 변경사항을 서버에 다시 보내서 정확한 데이터를 돌려 받게함
  // sendData(sball);
  // sendData(rball);
}

/* ================== 게임 정보 관련 끝 ================== */

/* ================== 서버 관련 시작 ================== */
const setupSocketEvents = (socket: Socket, end: boolean, instance: any) => {
  socket.on("user_id", function (data) {
    if (!end) return;
    myId = data;
  });

  socket.once("join_user", function (data: TPlayerBall[]) {
    if (!end) return;
    joinUser(data, instance);
  });

  socket.on("leave_user", function (data) {
    if (!end) return;
    leaveUser(data, instance);
  });

  socket.on("update_state", function (data: TPlayerBall) {
    if (!end) return;
    updateState(data, instance);
  });

  socket.on("update_bomb", function (data) {
    if (!end) return;
    updateBomb(data.sid, data.sbomb, data.rid, data.rbomb, instance);
  });

  socket.on(SocketServerEvent.GameEnd, function (data) {
    if (!end) return;
    gameFinished(data.loser, data.color);
  });

  function sendData(Player: TPlayerBall) {
    let data: TDataToServer = {
      id: Player.id,
      x: Player.x,
      y: Player.y,
    };
    if (data) {
      socket.emit("send_location", data);
    }
  }

  function bombChange(ballId1: string, ballId2: string) {
    if (ballId1 === undefined || ballId2 === undefined) return;

    console.log("bomb change");

    let data = {
      send: ballId1,
      receive: ballId2,
    };
    if (data) {
      socket.emit("bomb_change", data);
    }
  }

  function gameFinished(loser: string, color: string) {
    console.log("game ended");
    gameEnded = true;
    end = false;
  }

  return { sendData, bombChange, gameFinished };
};

/* ================== 서버 관련 끝 ================== */

/* ================== 캔버스 출력 관련 시작 ================== */

function ClearCanvas(ctx: any, canvas: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function shakeGenerator(amplitude: number) {
  let shakeArr: number[] = [
    Math.random() * amplitude,
    Math.random() * amplitude,
  ];
  return shakeArr;
}

function bombFlickering(bombflick: TBombFlick) {
  bombflick.frameCnt += 1;
  bombflick.x += 0.003 * bombflick.a;
  if (bombflick.frameCnt > bombflick.period) {
    bombflick.a += 1;
    bombflick.frameCnt = 0;
  }

  return Math.sin(bombFlick.x - 1.57) / 2.7 + 0.37;
}

type radius = {
  [index: string]: number;
  tl: number;
  tr: number;
  br: number;
  bl: number;
};

function roundRect(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | radius,
  fill: boolean,
  stroke: boolean | undefined
) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius: radius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

/* ================== 캔버스 출력 관련 끝================== */

function textLengthOverCut(txt: string, len: number, lastTxt: string) {
  const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  if (len === 0) {
    // 기본값
    len = 8;
  }
  if (lastTxt === "") {
    // 기본값
    lastTxt = "...";
  }
  if (korean.test(txt)) {
    //한글 겁나 뚱뚱함;;
    len = 5;
  }
  if (txt.length > len) {
    txt = txt.substr(0, len) + lastTxt;
  }
  return txt;
}

/* ================== 게임 설정 초기화 ================== */

function initializeBombGame() {
  ongoingData.gameTime = 0;
  ongoingData.gameEnded = false;
  ongoingData.myBombChangeFreeze = false;
  ongoingData.otherBombChangeFreeze = false;

  bombFlick.x = 0;
  bombFlick.a = 1;
  bombFlick.frameCnt = 0;
  bombFlick.period = 120;

  // balls = [];
  // ballMap = {};
  myId = "";

  gameEnded = false;
  gameStart = false;
}

/* ================== 게임 설정 초기화 ================== */

type TBombGameProps = {
  socket: Socket;
};

const BombGame = ({ socket }: TBombGameProps) => {
  const [instance] = useState(() => new BombGameData());

  // 첫 랜더링 때 바뀌는 전역변수들 초기화
  useEffect(() => {
    console.log("게임 설정 초기화");
    initializeBombGame();
  }, []);

  //canvas 사용을 위해 필요한 선언 1
  const canvasRef: any = useRef(null);

  //몬스터 이미지 로딩
  const monsterImgNameArr = [
    monsterImg1,
    monsterImg2,
    monsterImg3,
    monsterImg4,
    monsterImg5,
    monsterImg6,
    monsterImg7,
    monsterImg8,
  ];
  const monsterImgArr: HTMLImageElement[] = [];

  useEffect(() => {
    for (let i = 0; i < 8; i++) {
      const tempMonster = new Image();
      tempMonster.src = monsterImgNameArr[i];
      monsterImgArr.push(tempMonster);
    }
  }, []);

  // 소켓 초기화
  const { bombChange, sendData } = useMemo(
    () => setupSocketEvents(socket, true, instance),
    [socket]
  );

  // 튜토리얼 출력
  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
    setShowModal(false);
  };

  // 6초 뒤에 튜토리얼 창 끄게 해줌

  // 게임 요소 시작
  useEffect(() => {
    setTimeout(function () {
      closeModal();
      gameStartAnimation(instance, instance.gameCanvas.width);
      setTimeout(function () {
        gameStart = true;
      }, 3700);
    }, 6000);

    setTimeout(function () {
      console.log("캔버스 랜더링 시작");
      render();
      let event = setInterval(function () {
        handleGameEvents();
        if (gameEnded) {
          ifGameFinish();
          clearInterval(event);
        }
      }, 30);
    }, 6000);
  }, []);

  function Confetti(this: any) {
    //construct confetti
    const colours = ["#fde132", "#009bde", "#ff6b00"];

    this.x = Math.round(Math.random() * instance.gameCanvas.width);
    this.y =
      Math.round(Math.random() * instance.gameCanvas.height) -
      instance.gameCanvas.height / 2;
    this.rotation = Math.random() * 360;

    const size = Math.random() * (instance.gameCanvas.width / 60);
    this.size = size < 15 ? 15 : size;

    this.color = colours[Math.floor(colours.length * Math.random())];

    this.speed = this.size / 7;

    this.opacity = Math.random();

    this.shiftDirection = Math.random() > 0.5 ? 1 : -1;
  }

  Confetti.prototype.border = function () {
    if (this.y >= instance.gameCanvas.height) {
      this.y = instance.gameCanvas.height;
    }
  };

  Confetti.prototype.update = function () {
    this.y += this.speed;

    if (this.y <= instance.gameCanvas.height) {
      this.x += this.shiftDirection / 3;
      this.rotation += (this.shiftDirection * this.speed) / 100;
    }

    if (this.y > instance.gameCanvas.height) this.border();
  };

  Confetti.prototype.draw = function (ctx: any) {
    ctx.beginPath();
    ctx.arc(
      this.x,
      this.y,
      this.size,
      this.rotation,
      this.rotation + Math.PI / 2
    );
    ctx.lineTo(this.x, this.y);
    ctx.closePath();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  const confNum = Math.floor(instance.gameCanvas.width / 4);
  const confs = new Array(confNum)
    .fill(undefined)
    .map((_) => new (Confetti as any)());

  function drawGameFinish(ctx: any) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(
      0,
      0,
      instance.gameCanvas.width,
      instance.gameCanvas.height + instance.ifEnd.height
    );

    ctx.restore();

    ctx.save();
    confs.forEach((conf) => {
      conf.update();
      conf.draw(ctx);
    });
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 100px Trebuchet MS";
    ctx.fillText(
      "FINISH",
      35 + instance.ifEnd.height,
      instance.gameCanvas.height / 2
    );
    ctx.restore();
  }

  function ifGameFinish() {
    const gameEndtimer = setInterval(function () {
      instance.ifEnd.height += instance.gameCanvas.height / 100;
      if (instance.ifEnd.height > 0) {
        instance.ifEnd.height = 0;

        clearInterval(gameEndtimer);
      }
    }, 10);
  }

  let frameCnt = 0;

  /* 사용되는변수
    1. canvasRef
    2. gameEnded, framecnt
    3. gameBackGround
    4. balls 
    5. 타이머 요소
    6. ballRad
  */
  const render = () => {
    if (canvasRef.current === null) return;
    //canvas 사용을 위해 필요한 선언 2
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let balls = instance.balls;

    /*==== 캔버스 요소 조작 시작 ====*/

    ClearCanvas(ctx, canvas);

    ctx.save();

    // 게임 종료시 폭발 효과
    if (gameEnded) {
      if (frameCnt > 200) {
        ctx.translate(0, 0);
      } else {
        const shake = shakeGenerator(10);
        ctx.translate(shake[0], shake[1]);
        frameCnt += 1;
      }
    }

    // 게임 바탕 그림
    // ctx.drawImage(gameBackground, 0, 0, 360, 500);

    // 공들을 출력
    ctx.save();
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      let tempMonster = monsterImgArr[i];

      //이름 박스 출력
      ctx.save();
      if (ball.id === myId) {
        ctx.fillStyle = "limegreen";
      } else {
        ctx.fillStyle = "white";
      }
      roundRect(
        ctx,
        ball.x - initialData.ballRad - 10 - 5, //x
        ball.y - initialData.ballRad - 4 - 17 - 6, //y
        initialData.ballRad * 2 + 20 + 10, //width
        20, //height
        10, //radius
        true,
        false
      );
      ctx.restore();

      // 공 출력
      ctx.save();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, initialData.ballRad, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 그 위에 몬스터 이미지 출력
      ctx.drawImage(
        tempMonster,
        ball.x - initialData.ballRad - 2,
        ball.y - initialData.ballRad - 2,
        44,
        44
      );

      //폭탄을 들고 있는 공일 경우
      if (ball.bomb === true) {
        //폭탄 그리기
        ctx.drawImage(
          bomb,
          ball.x - initialData.ballRad - 15 - 20,
          ball.y - initialData.ballRad - 14 + 20,
          57,
          57
        );

        //폭탄이 점멸하게
        // f(x) = sin(x * a) * (1/2)
        if (!gameEnded) {
          let trans = bombFlickering(bombFlick);
          ctx.save();
          ctx.globalAlpha = trans;
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(
            ball.x - 20,
            ball.y + 20,
            initialData.ballRad,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        if (gameEnded) {
          ctx.drawImage(
            explosion,
            ball.x - initialData.ballRad - 50,
            ball.y - initialData.ballRad - 50,
            150,
            150
          );
        }

        /*==== 추가사항 ====*/
        if (ongoingData.otherBombChangeFreeze) {
          ctx.save();
          const shake = shakeGenerator(10);
          ctx.translate(shake[0], shake[1]);
          ctx.drawImage(
            electric,
            ball.x - initialData.ballRad - 25,
            ball.y - initialData.ballRad - 25,
            80,
            80
          );
          ctx.restore();
        }
        /*==== 추가사항 ====*/
      } // 폭탄일 경우 종료

      // 플레이어 이름 출력
      ctx.save();
      // 내 공일 경우
      if (ball.id === myId) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.font = "bold 15px Arial";
        ctx.fillText("나", ball.x - 7, ball.y - initialData.ballRad - 4 - 6);
        ctx.closePath();
      } else {
        // 상대 닉네임 출력
        let tempNickname = textLengthOverCut(ball.nickname, 7, "...");

        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.font = "bold 12px Arial";
        ctx.fillText(
          `${tempNickname}`,
          ball.x - initialData.ballRad - 7,
          ball.y - initialData.ballRad - 4 - 7 - 2
        );
        ctx.closePath();
      }
      ctx.restore();
    }
    ctx.restore();

    // 게임 종료시 피니쉬 효과 출력
    if (gameEnded) {
      // ctx.drawImage(explosion, 0, 70, 360, 360);
      drawGameFinish(ctx);
    }

    // 게임 시작시 카운트 다운 효과
    drawGameStart(
      ctx,
      instance.gameCanvas.width,
      instance.gameCanvas.height,
      instance.gameStartAnimation.value
    );
    ctx.restore();
    /*==== 캔버스 요소 조작 끝 ====*/

    //canvas에 애니메이션이 작동하게 하는 함수.
    requestAnimationFrame(render);
  };

  /* 사용되는변수
    1. balls, ballMap
    2. joystickData
    3. initialData.ballRad, ballMoveSpeed, bombMoveSpeed
    4. canvas height, width 
    5. 타이머 요소
  */
  function handleGameEvents() {
    if (gameEnded || !gameStart) {
      return;
    }

    let balls = instance.balls;
    let ballMap = instance.ballMap;

    /*==== 데이터 조작 후 서버 전송 ====*/
    const curPlayer = ballMap[myId];
    if (curPlayer === undefined) return;
    // 내가 직접 공 위치 클라 꺼는 바꾸면 안됌
    const curPlayerClone: TPlayerBall = JSON.parse(JSON.stringify(curPlayer));

    //조이스틱이 이동 중일 경우,
    if (joystickData.state === "move" && !ongoingData.myBombChangeFreeze) {
      let xySpeed: number[] = [joystickData.moveX, joystickData.moveY];

      // 조이스틱 이동 값에 따라 공 이동
      if (curPlayerClone.bomb) {
        curPlayerClone.x += xySpeed[0] * initialData.bombMoveSpeed;
        curPlayerClone.y += xySpeed[1] * initialData.bombMoveSpeed;
      } else {
        curPlayerClone.x += xySpeed[0] * initialData.ballMoveSpeed;
        curPlayerClone.y += xySpeed[1] * initialData.ballMoveSpeed;
      }

      let bombChangeHappend = false;

      // balls 라스트 안의 공들과 내 공의 출동 확인
      for (let ball of balls) {
        // 내가 직접 공 위치 클라 꺼는 바꾸면 안됌2
        const otherPlayerClone = JSON.parse(JSON.stringify(ball));

        if (curPlayerClone.id !== otherPlayerClone.id) {
          const collision: boolean = isBallCollision(
            curPlayerClone,
            otherPlayerClone,
            initialData.ballRad
          );

          // 충돌했을때
          if (collision) {
            console.log("collision");

            // 내가 폭탄일 경우, 상대방한테 넘겨줌
            if (
              curPlayerClone.bomb &&
              curPlayerClone !== undefined &&
              balls.length > 1 &&
              !bombChangeHappend
            ) {
              bombChange(curPlayerClone.id, otherPlayerClone.id);
              bombChangeHappend = true;
            }

            // 충돌 후 내 공 위치 조정
            let adjustedBallPosition3: number[] = adjustPosition(
              curPlayer,
              otherPlayerClone,
              initialData.ballRad
            );
            curPlayerClone.x += adjustedBallPosition3[0];
            curPlayerClone.y += adjustedBallPosition3[1];
          }
        }
      }

      // 벽 충돌 체크 후 tempSpeed를 업데이트
      let adjustedBallPosition2: number[] = isWallCollision(
        curPlayerClone,
        gameCanvas,
        initialData.ballRad
      );

      curPlayerClone.x = adjustedBallPosition2[0];
      curPlayerClone.y = adjustedBallPosition2[1];
    } else if (
      joystickData.state === "stop" &&
      !ongoingData.myBombChangeFreeze
    ) {
      // 조이스틱이 멈춰있고 내가 폭탄일떄,
      if (
        curPlayerClone.bomb &&
        curPlayerClone !== undefined &&
        balls.length > 1
      ) {
        let bombChangeHappend = false;
        // balls 라스트 안의 공들과 내 공의 출동 확인
        for (let ball of balls) {
          // 내가 직접 공 위치 클라 꺼는 바꾸면 안됌2
          const otherPlayerClone = JSON.parse(JSON.stringify(ball));

          if (curPlayerClone.id !== otherPlayerClone.id) {
            const collision: boolean = isBallCollision(
              curPlayerClone,
              otherPlayerClone,
              initialData.ballRad
            );

            // 충돌했을때
            if (collision) {
              console.log("collision");

              // 내가 폭탄일 경우, 상대방한테 넘겨줌
              if (!bombChangeHappend) {
                bombChange(curPlayerClone.id, otherPlayerClone.id);
                bombChangeHappend = true;
              }
            }
          }
        }
      }
    }

    if (curPlayerClone !== undefined) {
      sendData(curPlayerClone);
    }

    /*==== 데이터 조작 후 서버 전송 ====*/
  }

  return (
    <div className="hotBombPotato">
      <div>{showModal && <GameTutorial game="bomb" />}</div>
      <div className="bombgame">
        <div>
          <canvas
            id="canvasBG"
            ref={canvasRef}
            height={gameCanvas.height}
            width={gameCanvas.width}
          />
        </div>
        <div className="joystick">
          <Joystick
            size={100}
            baseColor="lightgray"
            stickColor="gray"
            move={handleMove}
            stop={handleStop}
            throttle={120}
          ></Joystick>
        </div>
      </div>
    </div>
  );
};

export default memo(BombGame);
