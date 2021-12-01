import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import pencilImg from "../../image/pencil.png";

const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

class GameData {
  gameCanvas = {
    width: 360,
    height: 360,
  };

  pencil = {
    x: 100,
    y: 100,
    width: 300,
    height: 300,
  };

  rotation = {
    degree: 0,
    speed: 1,
    time: 1,
  };

  initial = {
    maxTime: (5 + getRandom(0, 1.3)) * 60,
    maxSpeed: 10,
  };

  state = {
    gameStart: false,
  };
}

class Pencil {
  degree: number;

  //필요 없을 수도 있을 수도
  constructor(degree: number) {
    this.degree = degree;
  }

  rotate(ctx: any, image: any) {
    //pencil rotation 출력
    ctx.translate(250, 250);
    ctx.rotate((this.degree * Math.PI) / 180);
    ctx.translate(-250, -250);
  }
}

function PencilRotation(ctx: any, instance: any, image: any) {
  let data = new Pencil(instance.rotation.degree);
  data.rotate(ctx, image);

  const maxSpeed = instance.initial.maxSpeed;
  const maxTime = instance.initial.maxTime;
  let decelerationStart = false;

  /* Note
      speed range: 0~5
      rotation range per time: 0~1.3 is one cycle
  */

  // pencil rotate
  instance.rotation.degree += instance.speed;

  // 연필 회전 방향 및 가속,감속 결정
  if (instance.rotation.speed > 0) {
    //deceleration trigger
    if (instance.rotation.time > maxTime) {
      decelerationStart = true;
    }

    if (decelerationStart === true) {
      instance.rotation.speed -= 0.01; //감속
      console.log("slowing");
    } else if (instance.rotation.speed < maxSpeed) {
      instance.rotation.speed += 0.2; //가속
      console.log("speeding");
    } else {
      instance.rotation.time += 1; // 회전 유지 시간
      console.log("Rotating");
    }
    // console.log(instance.speed);
    // console.log(maxTime);
  }
  // 연필 정지 시 게임 정보 초기화
  else {
    instance.rotation.speed = 0;
    instance.rotation.time = 1;
    instance.initial.maxTime = (5 + getRandom(0, 1.3)) * 60; // 최대 회전시간 재설정(랜덤을위해)
  }
}

function ClearCanvas(ctx: any, canvas: any) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function App() {
  //canvas 사용을 위해 필요한 선언 1
  const canvasRef: any = useRef(null);

  const [instance] = useState(() => new GameData());

  // image
  const image = new Image();
  image.src = pencilImg;

  // 게임을 시작하거나, 게임이 시작된 후 다시 초기화 시킴.
  const handleCanvasClick = () => {
    if (!instance.state.gameStart) {
      // 게임 시작
      instance.state.gameStart = true;
    } else {
      // 게임 설정 초기화
      instance.state.gameStart = false;
      instance.rotation.speed = 1;
    }
  };

  useEffect(() => {
    const render = () => {
      //canvas 사용을 위해 필요한 선언 2
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      /*==== 캔버스 요소 조작 시작====*/
      ClearCanvas(ctx, canvas);

      ctx.font = "30px Arial";
      ctx.fillText("슈퍼 연필 돌리기!", 120, 50);

      ctx.save(); //원래 설정을 저장한다.

      // 연필이 한번 회전한 후 멈춰있을 경우
      if (instance.rotation.speed === 0) {
        ctx.fillText("다시 플레이하려면 클릭!", 70, 430);
      }

      // 클릭을 통해 연필 돌리기 게임이 시작 요청을 받았거나
      if (instance.state.gameStart) {
        PencilRotation(ctx, instance, image);
      }
      // 클릭 이벤트가 아직 발생하지 않은 경우
      else {
        ctx.fillText("연필을 클릭하시면 돕니다!", 70, 430);
      }

      // Pencil draw
      ctx.drawImage(
        image,
        instance.pencil.x,
        instance.pencil.y,
        instance.pencil.width,
        instance.pencil.height
      );

      ctx.restore(); // 원래 설정을 복원한다.

      /*==== 캔버스 요소 조작 끝====*/

      //canvas에 애니메이션이 작동하게 하는 함수.
      requestAnimationFrame(render);
    };
    render();
  });

  return (
    <div className="PencilSpin">
      <canvas
        id="canvas"
        ref={canvasRef}
        onClick={handleCanvasClick}
        height={instance.gameCanvas.height}
        width={instance.gameCanvas.width}
      />
    </div>
  );
}

export default App;
