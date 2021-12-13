import React, { useRef, useEffect, useState, memo } from "react";
import "./LeftOrRightGame.scss";

//이미지
import BlueMonsterImg from "../../image/BlueMonster.png";
import GreenMonsterImg from "../../image/GreenMonster.png";
// import ArrowLeftButtonImg from "../../image/ArrowLeftButton.png";
// import ArrowRightButtonImg from "../../image/ArrowRightButton.png";
import ArrowLeftButtonImg from "../../image/neonArrowLeft.png";
import ArrowRightButtonImg from "../../image/neonArrowRight.png";
// 화살표 버튼 소스(다른 색도 있음) https://www.iconsdb.com/barbie-pink-icons/arrow-left-icon.html

// 반응형
import { useMediaQuery } from "react-responsive";

// 서버
import { Socket } from "socket.io-client";
// import { SocketServerEvent } from "../../constants/socket";

import tutorialImage from "../../image/tutorialLeftRight.png";

//게임 시작 애니메이션
//총 3.7초 3700
import {
  drawGameStart,
  gameStartAnimation,
} from "../../utils/gameStartAnimation";

type TGameCanvas = {
  height: number;
  width: number;
};

class GameData {
  gameCanvas: TGameCanvas = {
    width: 360,
    height: 500 + 140,
  };

  gameStartAnimation = {
    value: 0,
  };

  state = {
    ended: false,
    started: false,
  };

  ifEnd = {
    height: -(500 + 140),
  };

  ballDistance = {
    x: 10, //임시
    y: 32, //공 위아래 간격
  };

  timer = {
    width: 30,
    maxWidth: 360 - 40 * 2,
    maxPlayTime: 15, //15초
    cntDownTime: 3700,
    time: 0,
  };

  score = {
    location: 160,
  };

  button = {
    // 버튼 위치 세로 = height/ 3 = 167 * 2 = 334, 가로 좌우 마진 30px 4등분 300 / 4 = 75, 왼쪽 75 오른쪽 225
    height: 75,
    width: 75,
    margin: 25,

    left: {
      x: 25,
      y: 500 + 140 - 75 - 50, //canvas height - button Height - 50;
    },

    right: {
      x: 360 - 75 - 25, //canvas width - button width - margin
      y: 500 + 140 - 75 - 50,
    },
  };
}

class Monster {
  isBlue: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  goLeft: boolean;

  constructor(blueOrGreen: boolean) {
    this.isBlue = blueOrGreen;
    this.width = 75;
    this.height = 75;
    this.x = 180 - 37;
    this.y = (500 + 140) / 3;
    this.goLeft = true;
  }
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

function ClearCanvas(ctx: any, canvas: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

type TBombGameProps = {
  socket: Socket;
};

function LeftOrRightGame({ socket }: TBombGameProps) {
  //canvas 사용을 위해 필요한 선언 1
  const canvasRef: any = useRef(null);

  const [instance] = useState(() => new GameData());

  let wrongMonster: any = null;
  const monsterList: any = [];
  const monsterLRList: any = [];

  let score = 0;

  // 이미지 로딩
  const blueMonster = new Image();
  blueMonster.src = BlueMonsterImg;
  const greenMonster = new Image();
  greenMonster.src = GreenMonsterImg;
  const ArrowLeftButton = new Image();
  ArrowLeftButton.src = ArrowLeftButtonImg;
  const ArrowRightButton = new Image();
  ArrowRightButton.src = ArrowRightButtonImg;
  const tutorial = new Image();
  tutorial.src = tutorialImage;

  //키보드 좌우 클릭 감지

  useEffect(() => {
    setTimeout(function () {
      window.addEventListener("keydown", (event) => {
        if (instance.state.ended === true) return;

        if (event.key === "ArrowLeft") {
          leftOrRightEventHandle("left");
        } else if (event.key === "ArrowRight") {
          leftOrRightEventHandle("right");
        }
      });
    }, 3700 + 4000);
  });

  useEffect(() => {});

  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });

  // onclick + touch handler in canvas tag
  const handleCanvasClick = (event: any) => {
    if (
      instance.state.ended === true ||
      instance.gameStartAnimation.value <= 10000
    )
      return;

    const canvas2 = canvasRef.current;
    const rect = canvas2.getBoundingClientRect();
    let x;
    let y;

    // if (isTabletOrMobile) {
    //   x = event.clientX;
    //   y = event.clientY;
    // } else {
    x = event.clientX - rect.left; //canvas.offsetLeft or Right
    y = event.clientY - rect.top;

    // left button for Green
    if (
      x >= 0 &&
      instance.button.left.x + instance.button.width + 20 >= x &&
      y >= instance.button.left.y - 20 &&
      instance.button.left.y + instance.button.height + 40 >= y
    ) {
      leftOrRightEventHandle("left");
    } else if (
      // right button for Blue
      x >= instance.button.right.x - 20 &&
      instance.button.right.x + instance.button.width + 40 >= x &&
      y >= instance.button.right.y - 20 &&
      instance.button.right.y + instance.button.height + 40 >= y
    ) {
      leftOrRightEventHandle("right");
    }
  };

  function leftOrRightEventHandle(whichPressed: string) {
    const ball = monsterList.pop();
    let success = true;

    if (
      (ball.isBlue && whichPressed === "right") ||
      (!ball.isBlue && whichPressed === "left")
    ) {
      success = true;
    } else {
      success = false;
    }

    // 성적 체크;
    if (!success) {
      score -= 2;

      // 실패 효과 출력
      wrongMonster = ball;
      setTimeout(() => {
        wrongMonster = null;
      }, 400);
    } else {
      score += 1;

      if (whichPressed === "left") {
        ball.goLeft = true;
      } else {
        ball.goLeft = false;
      }
      monsterLRList.push(ball);
    }

    // 새 공 추가
    const monster = makeNewMonster();
    monsterList.unshift(monster);

    moveMonster();
  }

  function makeNewMonster() {
    const random_boolean = Math.random() < 0.5;
    return new Monster(random_boolean);
  }

  // on button click, start the animation
  function moveMonster() {
    //세로 이동
    let initialY = 0;
    //현재 공의 위치를 저장한 뒤에, setinterval로 해당 공을 32px 아래만큼 이동시키고 clearinterval
    initialY += monsterList[1].y;

    let ballDownSpeed = 2;

    const animation = setInterval(function () {
      monsterList.forEach(function (item: any, index: any, array: any) {
        array[index].y = item.y + ballDownSpeed;
      });

      if (monsterList[1].y - monsterList[0].y < instance.ballDistance.y) {
        monsterList[0].y -= ballDownSpeed;
      }

      if (initialY + instance.ballDistance.y <= monsterList[1].y) {
        clearInterval(animation);
      }
    }, 5);

    if (monsterLRList.lengt === 0) return;
    // 가로 이동
    let cnt2 = 0;

    const animationLR = setInterval(function () {
      monsterLRList.forEach(function (item: any, index: any, array: any) {
        if (item.goLeft) {
          array[index].x = item.x - 2;
        } else {
          array[index].x = item.x + 2;
        }
      });
      cnt2 += 1;
      if (cnt2 > 130) {
        clearInterval(animationLR);
      }
    }, 10);
  }

  // draw monster ball
  function drawMonster(ctx: any) {
    if (monsterList.length === 0) return;

    for (let i = 0; i < monsterList.length; i++) {
      const monsterBall: any = monsterList[i];

      if (monsterBall.isBlue) {
        ctx.drawImage(
          blueMonster,
          monsterBall.x,
          monsterBall.y,
          monsterBall.width,
          monsterBall.height
        );
      } else {
        ctx.drawImage(
          greenMonster,
          monsterBall.x,
          monsterBall.y,
          monsterBall.width,
          monsterBall.height
        );
      }
    }
  }

  function drawMonsterLeftRight(ctx: any) {
    if (monsterLRList.length === 0) return;

    for (let i = 0; i < monsterLRList.length; i++) {
      const monsterLRBall: any = monsterLRList[i];

      if (monsterLRBall.isBlue) {
        ctx.drawImage(
          blueMonster,
          monsterLRBall.x,
          monsterLRBall.y,
          monsterLRBall.width,
          monsterLRBall.height
        );
      } else {
        ctx.drawImage(
          greenMonster,
          monsterLRBall.x,
          monsterLRBall.y,
          monsterLRBall.width,
          monsterLRBall.height
        );
      }
    }
  }

  function drawButton(ctx: any) {
    ctx.drawImage(
      ArrowLeftButton,
      instance.button.left.x,
      instance.button.left.y,
      instance.button.width,
      instance.button.height
    );

    ctx.drawImage(
      ArrowRightButton,
      instance.button.right.x,
      instance.button.right.y,
      instance.button.width,
      instance.button.height
    );
  }

  function drawWhichLR(ctx: any, location: string) {
    let positionX = 0;
    let text = "";
    let img: HTMLImageElement = greenMonster;
    if (location === "left") {
      positionX = instance.button.left.x;
      text = "좌측으로";
    } else if (location === "right") {
      positionX = instance.button.right.x;
      text = "우측으로";
      img = blueMonster;
    }

    let radius: radius = {
      tl: 5,
      tr: 5,
      br: 40,
      bl: 40,
    };
    // 하얀색 아래쪽 둥근 바탕
    ctx.save();
    ctx.fillStyle = "#DC143C";
    roundRect(
      ctx,
      positionX,
      instance.button.left.y - 110 - 30,
      instance.button.width,
      110,
      radius,
      true,
      false
    );
    ctx.restore();

    //header
    let radiusHeader: radius = {
      tl: 5,
      tr: 5,
      br: 0,
      bl: 0,
    };

    ctx.save();
    ctx.fillStyle = "white";
    roundRect(
      ctx,
      positionX,
      instance.button.left.y - 110 - 30,
      instance.button.width,
      25,
      radiusHeader,
      true,
      false
    );
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#DC143C";
    ctx.font = "bold 18px Trebuchet MS";
    ctx.fillText(
      `${text}`,
      positionX + 3,
      instance.button.left.y - 110 - 30 + 21
    );
    ctx.restore();

    ctx.drawImage(
      img,
      positionX + 7,
      instance.button.left.y - 110 - 30 + 25 + 12,
      60,
      60
    );
  }

  function drawScore(ctx: any) {
    ctx.save();
    ctx.font = "bold 100px Trebuchet MS";
    ctx.fillStyle = "white";

    if (score < 10 && score >= 0) {
      // 양수 일의 자리
      ctx.fillText(`${score}`, 180 - 20, instance.score.location);
    } else if (score < -1 && score > -10) {
      // 음수 일의 자리
      ctx.fillText(`${score}`, 180 - 50, instance.score.location);
    } else if (score <= -10) {
      // 음수 10이상
      ctx.fillText(`${score}`, 180 - 90, instance.score.location);
    } else {
      // 양수 10이상
      ctx.fillText(`${score}`, 180 - 60, instance.score.location);
    }

    ctx.save();
    ctx.font = "bold 30px Trebuchet MS";
    ctx.fillText("your score", 180 - 70, instance.score.location + 30);
    ctx.restore();
    ctx.restore();
  }

  function drawTimer(ctx: any) {
    let time = instance.timer.time;
    //header
    let radius: radius = {
      tl: 17,
      tr: 17,
      br: 17,
      bl: 17,
    };
    ctx.save();
    ctx.fillStyle = "DarkRed";
    roundRect(ctx, 40, 30, 360 - 40 - 40, 30, radius, true, false);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "white";
    // 흰색 바
    roundRect(ctx, 40, 30, instance.timer.width, 30, radius, true, false);

    ctx.beginPath();
    ctx.arc(40 + 15, 30 + 15, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#ff4d4d";
    ctx.font = "bold 16px Trebuchet MS";
    ctx.fillText(`${time.toFixed(2)}`, 180 - 15, 30 + 20);
    ctx.restore();
  }

  function drawWrong(ctx: any) {
    if (wrongMonster === null) return;
    let img;

    if (wrongMonster.isBlue) {
      img = blueMonster;
    } else {
      img = greenMonster;
    }
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "red";

    ctx.drawImage(
      img,
      wrongMonster.x,
      wrongMonster.y,
      wrongMonster.width,
      wrongMonster.height
    );

    ctx.beginPath();
    ctx.arc(
      wrongMonster.x + 75 / 2,
      wrongMonster.y + 75 / 2,
      75 / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.restore();
  }

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
    instance.state.ended = true;

    const gameEndtimer = setInterval(function () {
      instance.ifEnd.height += instance.gameCanvas.height / 100;
      if (instance.ifEnd.height > 0) {
        instance.ifEnd.height = 0;

        clearInterval(gameEndtimer);
      }
    }, 10);
  }

  // initialize game
  useEffect(() => {
    // load monster balls
    // 처음엔 공 9개만 출력해야 문제 안생김!
    setTimeout(function () {
      for (let i = 1; i < 10; i++) {
        const monster = makeNewMonster();

        //위부터 아래까지 일렬로 늘어지게
        let sth = instance.ballDistance.y;
        monster.y += sth * i; // 32 * 9 = 288 최저 위치

        monsterList.push(monster);
      }
    }, 3700 + 4000);
  });

  useEffect(() => {
    setTimeout(function () {
      instance.state.started = true;
      gameStartAnimation(instance, instance.gameCanvas.width);
    }, 4000);

    //타이머
    setTimeout(function () {
      const timer = setInterval(function () {
        instance.timer.time += 0.01;
        instance.timer.width +=
          (instance.timer.maxWidth - 30) / (instance.timer.maxPlayTime * 100);
        if (instance.timer.time > instance.timer.maxPlayTime) {
          instance.timer.time = instance.timer.maxPlayTime;
          instance.timer.width = instance.timer.maxWidth;

          // 게임 종료
          ifGameFinish();
          clearInterval(timer);
        }
      }, 10);
    }, 3700 + 4000); //

    //일정 시간 후 게임 결과 송신
    setTimeout(function () {
      socket.emit("lrEnd", score);
    }, instance.timer.maxPlayTime * 1000 + 3000 + 3700 + 4000);
  });

  useEffect(() => {
    render();
  });

  const render = () => {
    if (canvasRef.current === null) return;
    //canvas 사용을 위해 필요한 선언 2
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ClearCanvas(ctx, canvas);

    drawTimer(ctx);
    drawScore(ctx);

    drawMonster(ctx);
    drawWrong(ctx);

    drawMonsterLeftRight(ctx);

    drawWhichLR(ctx, "left");
    drawWhichLR(ctx, "right");

    drawButton(ctx);

    if (instance.state.ended) {
      drawGameFinish(ctx);
    }

    drawGameStart(
      ctx,
      instance.gameCanvas.width,
      instance.gameCanvas.height,
      instance.gameStartAnimation.value
    );

    if (!instance.state.started) {
      ctx.drawImage(tutorial, 0, 75, instance.gameCanvas.width, 34 * 14.4);
    }

    requestAnimationFrame(render);
  };

  return (
    <div className="LeftOrRightGame">
      <div>
        <canvas
          id="canvasLR"
          ref={canvasRef}
          height={instance.gameCanvas.height}
          width={instance.gameCanvas.width}
          onClick={handleCanvasClick}
        />
      </div>
    </div>
  );
}

export default memo(LeftOrRightGame);
