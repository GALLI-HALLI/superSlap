import React, { useEffect, useRef } from 'react';
import './App.css';
import { Joystick } from 'react-joystick-component';
import io from 'socket.io-client'
import isWallCollision from './isWallCollision';
import isBallCollision from './isBallCollision';
import adjustBallPosition from './adjustPosition';
import bombImage from './image/bomb.png'
import backgroundImage from './image/gameBackground.jpg'
import backgroundImage2 from './image/gameBackground2.jpg'

/* ================== 조이스틱 관련 시작 ================== */
type JoystickDirection = "FORWARD" | "RIGHT" | "LEFT" | "BACKWARD";

interface IJoystickUpdateEvent {
  type: "move" | "stop" | "start";
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
}

const joystickData = {
  moveX: 0,
  moveY: 0,
  state: "stop",
}

const handleMove = (event: IJoystickUpdateEvent) => {
  const x: number | null = event.x;
  const y: number | null = event.y;
  joystickData.state = event.type;

  if (x != null && y != null) {
    joystickData.moveX = x / 50;
    joystickData.moveY = y / -50;
  }
}

const handleStop = (event: IJoystickUpdateEvent) => {
  joystickData.state = event.type;
}

/* ================== 조이스틱 관련 끝 ================== */

/* ================== 이미지 관련 시작 ================== */

const bomb = new Image();
bomb.src = bombImage;

const gameBackground = new Image();
gameBackground.src = backgroundImage2;

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
    this.x = 360/2;
    this.y = 500/2;
    this.bomb = false;
  }
}

type playerBallType = {
  id: string;
  color: string;
  x: number;
  y: number;
  bomb: boolean;
}

type dataToServer = {
  id: string;
  x: number;
  y: number;
}

/* ================== 타입 및 클래스 선언 끝================== */

/* ================== 게임 정보 관련 시작 ================== */
//Note: 현재 픽셀 위치 설정은 canvas 360x500을 기준으로 맞춰져있습니다.
const canvasWidth = 360;
const canvasHeight = 500;
const ballRad = 20;
const ballMoveSpeed = 2; // 1 보다 큰 수로 속도 배율
const bombMoveSpeed = 3; // 폭탄은 유저보다 빠르게

const balls: playerBallType[] = [];
const ballMap: Record<string, playerBall> = {};
let myId: string;
let gameEnd = false;



function joinUser(id: string, color: string, x: number, y: number, bomb: boolean){
  console.log("join user");
  let ball = new playerBall();
  ball.id = id;
  ball.color = color;
  ball.x = x;
  ball.y = y;
  ball.bomb = bomb;

  balls.push(ball);
  ballMap[id] = ball;

  return ball;
}

function leaveUser(id: string){
  for(var i = 0 ; i < balls.length; i++){
      if(balls[i].id === id){
          balls.splice(i,1);
          break;
      }
  }
  delete ballMap[id];
}

function updateState(id: string, x: number, y: number, bomb: boolean){
  
  for(let i = 0 ; i < balls.length; i++){
    if(balls[i].id === id) {
      balls[i].x = x;
      balls[i].y = y;
      balls[i].bomb = bomb;
      break;
    }
  }

  let ball = ballMap[id];
  if(!ball){
      return;
  }
  ball.x = x;
  ball.y = y;
  ball.bomb = bomb;
}

function updateBomb(sid: string, sbomb: boolean, rid: string, rbomb: boolean){
  for(let i = 0 ; i < balls.length; i++){
    if(balls[i].id === sid) {
      balls[i].bomb = sbomb;
      break;
    }
    if(balls[i].id === rid) {
      balls[i].bomb = rbomb;
      break;
    }
  }

  let sball = ballMap[sid];
  let rball = ballMap[rid];

  if(!sball){ return; }
  if(!rball){ return; }

  sball.bomb = sbomb;
  rball.bomb = rbomb;

  //클라이언트 사이드에서 생긴 변경사항을 서버에 다시 보내서 정확한 데이터를 돌려 받게함
  // sendData(sball);
  // sendData(rball);
}


/* ================== 게임 정보 관련 끝 ================== */

/* ================== 서버 관련 시작 ================== */
const socket = io();

socket.on('user_id', function(data){
  myId = data;
});

socket.on('join_user', function(data){
  joinUser(data.id, data.color, data.x, data.y, data.bomb);
});

socket.on('leave_user', function(data){
  leaveUser(data);
});

socket.on('update_state', function(data){
  updateState(data.id, data.x, data.y, data.bomb);
});

socket.on('update_bomb', function(data){
  updateBomb(data.sid, data.sbomb, data.rid, data.rbomb);
});

socket.on('game_end', function(data){
  gameFinished(data.loser, data.color);
});

function sendData(Player: playerBallType) {
  let data: dataToServer = {
    id: Player.id,
    x: Player.x,
    y: Player.y,
  }
  if(data){
      socket.emit("send_location", data);
  }
}

function bombChange(ballId1: string, ballId2: string) {
  console.log("bomb change");
  let data = {
    send: ballId1,
    receive: ballId2,
  }
  if (data) {
    socket.emit("bomb_change", data);
  }
}

const playTime = 30;
let progressBarHeight = 0;
let gameTime = 0;

function gameStart() {
  let data = true;
  socket.emit("game_start", data)
  
  progressBarHeight = 0;
  gameTime = 0;
  let timer = setInterval(function() {
    gameTime += 0.1;
    progressBarHeight += 1.666666667;
    console.log(gameTime);
    if (gameTime >= playTime) {
      clearInterval(timer);
    }
  }, 100)
}

function gameFinished(loser: string, color: string) {

}


/* ================== 서버 관련 끝 ================== */

/* ================== 캔버스 출력 관련 시작 ================== */

function ClearCanvas(ctx: any, canvas: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ================== 캔버스 출력 관련 끝================== */

/* ================== 게임 외적 함수 시작 ================== */




/* ================== 게임 외적 함수 끝 ================== */

function App() {
  //canvas 사용을 위해 필요한 선언 1
  const canvasRef: any = useRef(null);

  const render = () => {
    //canvas 사용을 위해 필요한 선언 2
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    /*==== 캔버스 요소 조작 시작 ====*/

    ClearCanvas(ctx, canvas);

    ctx.drawImage(gameBackground, 0, 0, 360, 500);
    
    // 공들 출력
    ctx.save();
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRad, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      if (ball.bomb === true) {
        ctx.drawImage(bomb, ball.x - ballRad - 15, ball.y- ballRad - 14, 57, 57);
      }
      
      ctx.beginPath();
      ctx.font = '15px Arial';
      ctx.fillText(`player ${i}`,ball.x - ballRad - 7, ball.y - ballRad - 4);
      ctx.closePath();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(355, 500, 5, -progressBarHeight);
    ctx.stroke()
    ctx.restore();

    /*==== 캔버스 요소 조작 끝 ====*/

    //canvas에 애니메이션이 작동하게 하는 함수. 
    requestAnimationFrame(render);
  };

  const handleGameEvents = () => {
    /*==== 데이터 조작 후 서버 전송 ====*/
    // 내가 직접 공 위치 바꾸면 안됌1(수정예정)
    const curPlayer = ballMap[myId];
    const curPlayerClone: playerBallType = JSON.parse(JSON.stringify(curPlayer));

    if (joystickData.state === "move"){
      let xySpeed: number[] = [joystickData.moveX, joystickData.moveY];

      // 조이스틱 이동 값에 따라 공 이동
      if (curPlayerClone.bomb) {
        curPlayerClone.x += xySpeed[0] * bombMoveSpeed;
        curPlayerClone.y += xySpeed[1] * bombMoveSpeed;
      } else {
        curPlayerClone.x += xySpeed[0] * ballMoveSpeed;
        curPlayerClone.y += xySpeed[1] * ballMoveSpeed;
      }
      
      let bombChangeHappend = false;

      // balls 라스트 안의 공들과 내 공의 출동 확인
      for (let ball of balls) {
        // 내가 직접 공 위치 바꾸면 안됌2(수정예정)
        const otherPlayerClone = JSON.parse(JSON.stringify(ball));
        

        if (curPlayerClone.id !== otherPlayerClone.id) {
          const collision: boolean = isBallCollision(curPlayerClone, otherPlayerClone, ballRad);

          // 충돌했을때
          if (collision) {
            console.log("collision");

            // 내가 폭탄일 경우, 상대방한테 넘겨줌
            if (curPlayerClone.bomb && curPlayerClone !== undefined && balls.length > 1 && !bombChangeHappend) {
              bombChange(curPlayerClone.id, otherPlayerClone.id);

              // 부딕친 상대 공을 튕겨 나가게 해줌.
              otherPlayerClone.x += xySpeed[0] * 60;
              otherPlayerClone.y += xySpeed[1] * 60; 

              let adjustedBallPosition1: number[] = isWallCollision(otherPlayerClone, canvasHeight, canvasWidth, ballRad);
              otherPlayerClone.x = adjustedBallPosition1[0];
              otherPlayerClone.y = adjustedBallPosition1[1];

              sendData(otherPlayerClone);

              bombChangeHappend = true;
            } 

            // 충돌 후 내 공 위치 조정
            let adjustedBallPosition3: number[] = adjustBallPosition(curPlayer, otherPlayerClone, xySpeed, ballRad);
            curPlayerClone.x += adjustedBallPosition3[0];
            curPlayerClone.y += adjustedBallPosition3[1];
          }
        }
      }
      // 벽 충돌 체크 후 tempSpeed를 업데이트
      let adjustedBallPosition2: number[] = isWallCollision(curPlayerClone, canvasHeight, canvasWidth, ballRad);
      curPlayerClone.x = adjustedBallPosition2[0];
      curPlayerClone.y = adjustedBallPosition2[1];

    } else if (joystickData.state === "stop") {
      if (curPlayerClone.bomb && curPlayerClone !== undefined && balls.length > 1) {

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
          height={canvasHeight}
          width={canvasWidth} />
      </div>
      <div className="joystick">
        <Joystick 
          size={100} 
          baseColor="lightgray" 
          stickColor="gray" 
          move={handleMove} 
          stop={handleStop}
          throttle={120}
        >
        </Joystick>
      </div>
      <button onClick={() => {gameStart();}}>
        게임 시작
      </button>
    </div>
  );
}

export default App;
