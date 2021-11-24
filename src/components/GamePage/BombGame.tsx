import React, { memo, useEffect, useMemo, useRef } from "react";
import { Joystick } from "react-joystick-component";
import { Socket } from "socket.io-client";
import { SocketServerEvent } from "../../constants/socket";
import "./BombGame.css";

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
} from "../../types/bombGameTypes";

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
  color: string;
  x: number;
  y: number;
  bomb: boolean;

  constructor() {
    this.id = "";
    this.color = "#FF00FF";
    this.x = 360 / 2;
    this.y = 500 / 2;
    this.bomb = false;
  }
}

/* ================== 타입 및 클래스 선언 끝================== */

/* ================== 게임 정보 관련 시작 ================== */
//Note: 현재 픽셀 위치 설정은 canvas 360x500을 기준으로 맞춰져있습니다.
const gameCanvas: TGameCanvas = {
  width: 360,
  height: 500,
};

const initialData: TGameIntialData = {
  ballRad: 20,
  ballMoveSpeed: 2, // 1 보다 큰 수로 속도 배율
  bombMoveSpeed: 3, // 폭탄은 유저보다 빠르게
  maxPlayTime: 30,
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

const balls: TPlayerBall[] = [];
const ballMap: Record<string, playerBall> = {};
let myId: string;

const maxPlayTime = 30;
let progressBarHeight = 0;
let gameTime = 0;
let gameEnded = false;

function joinUser(data: TPlayerBall) {
  console.log("join user");
  let ball = new playerBall();
  ball.id = data.id;
  ball.color = data.color;
  ball.x = data.x;
  ball.y = data.y;
  ball.bomb = data.bomb;

  balls.push(ball);
  ballMap[data.id] = ball;

  return ball;
}

function leaveUser(id: string) {
  for (var i = 0; i < balls.length; i++) {
    if (balls[i].id === id) {
      balls.splice(i, 1);
      break;
    }
  }
  delete ballMap[id];
}

function updateState(data: TPlayerBall) {
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

function updateBomb(sid: string, sbomb: boolean, rid: string, rbomb: boolean) {
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
    }, 5000);
  }

  ongoingData.otherBombChangeFreeze = true;
  setTimeout(function () {
    ongoingData.otherBombChangeFreeze = false;
  }, 5000);
  //클라이언트 사이드에서 생긴 변경사항을 서버에 다시 보내서 정확한 데이터를 돌려 받게함
  // sendData(sball);
  // sendData(rball);
}

/* ================== 게임 정보 관련 끝 ================== */

/* ================== 서버 관련 시작 ================== */
const setupSocketEvents = (socket: Socket) => {
  socket.on("user_id", function (data) {
    myId = data;
  });

  socket.on("join_user", function (data: TPlayerBall) {
    joinUser(data);
  });

  socket.on("leave_user", function (data) {
    leaveUser(data);
  });

  socket.on("update_state", function (data: TPlayerBall) {
    updateState(data);
  });

  socket.on("update_bomb", function (data) {
    updateBomb(data.sid, data.sbomb, data.rid, data.rbomb);
  });

  socket.on(SocketServerEvent.GameEnd, function (data) {
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
    gameEnded = true;
  }

  return { sendData, bombChange, gameFinished };
};

/* ================== 서버 관련 끝 ================== */

/* ================== 캔버스 출력 관련 시작 ================== */

function ClearCanvas(ctx: any, canvas: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ================== 캔버스 출력 관련 끝================== */

/* ================== 게임 외적 함수 시작 ================== */

function shakeGenerator(amplitude: number) {
  let shakeArr: number[] = [
    Math.random() * amplitude,
    Math.random() * amplitude,
  ];
  return shakeArr;
}

/* ================== 게임 외적 함수 끝 ================== */

type TBombGameProps = {
  socket: Socket;
};

const BombGame = ({ socket }: TBombGameProps) => {
  //canvas 사용을 위해 필요한 선언 1
  const canvasRef: any = useRef(null);

  const { bombChange, sendData } = useMemo(
    () => setupSocketEvents(socket),
    [socket]
  );

  //타이머 용
  useEffect(() => {
    timerData.progressBarHeight = 0;
    ongoingData.gameTime = 0;
    let timer = setInterval(function () {
      ongoingData.gameTime += 0.1;
      timerData.progressBarHeight += 1.666666667;
      if (ongoingData.gameTime >= initialData.maxPlayTime) {
        clearInterval(timer);
      }
    }, 100);
  }, []);

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
    //canvas 사용을 위해 필요한 선언 2
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    /*==== 캔버스 요소 조작 시작 ====*/

    ClearCanvas(ctx, canvas);

    ctx.save();
    if (gameEnded) {
      if (frameCnt > 360) {
        ctx.translate(0, 0);
      } else {
        const shake = shakeGenerator(10);
        ctx.translate(shake[0], shake[1]);
        frameCnt += 1;
      }
    }
    ctx.restore();

    ctx.drawImage(gameBackground, 0, 0, 360, 500);

    // 공들 출력
    ctx.save();
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];

      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, initialData.ballRad, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      if (ball.bomb === true) {
        ctx.drawImage(
          bomb,
          ball.x - initialData.ballRad - 15,
          ball.y - initialData.ballRad - 14,
          57,
          57
        );

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
      }

      // 플레이어 이름 출력
      if (ball.id === myId) {
        ctx.beginPath();
        ctx.font = "15px Arial";
        ctx.fillText(
          "나야 나!",
          ball.x - initialData.ballRad - 7,
          ball.y - initialData.ballRad - 4
        );
        ctx.closePath();
      } else {
        ctx.beginPath();
        ctx.font = "15px Arial";
        ctx.fillText(
          `player ${i}`,
          ball.x - initialData.ballRad - 7,
          ball.y - initialData.ballRad - 4
        );
        ctx.closePath();
      }
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(355, 500, 5, -timerData.progressBarHeight);
    ctx.stroke();
    ctx.restore();

    if (gameEnded) {
      ctx.drawImage(explosion, 0, 70, 360, 360);
    }

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
  const handleGameEvents = () => {
    /*==== 데이터 조작 후 서버 전송 ====*/
    const curPlayer = ballMap[myId];
    // 내가 직접 공 위치 클라 꺼는 바꾸면 안됌
    const curPlayerClone: TPlayerBall = JSON.parse(JSON.stringify(curPlayer));

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
              xySpeed,
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
      if (
        curPlayerClone.bomb &&
        curPlayerClone !== undefined &&
        balls.length > 1
      ) {
      }
    }

    if (curPlayerClone !== undefined) {
      sendData(curPlayerClone);
    }

    /*==== 데이터 조작 후 서버 전송 ====*/
  };

  useEffect(() => {
    render();
    setInterval(handleGameEvents, 20);
  });

  return (
    <div className="hotBombPotato">
      <div>
        <canvas
          id="canvas"
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
  );
};

export default memo(BombGame);
