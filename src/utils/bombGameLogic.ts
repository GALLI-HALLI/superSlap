import { TPlayerBall, TGameCanvas } from "../types/bombGameTypes";

export function isWallCollision(
  playerBall: any,
  canvas: TGameCanvas,
  ballRad: number
) {
  let tempX: number = playerBall.x;
  let tempY: number = playerBall.y;

  if (tempY - ballRad <= 0) {
    //천장
    tempY = ballRad;
    console.log("hit bottom");
  } else if (tempY + ballRad >= canvas.height) {
    //바닥
    tempY = canvas.height - ballRad;
    console.log("hit top");
  }

  if (playerBall.x - ballRad <= 0) {
    //왼쪽 벽
    tempX = ballRad;
    console.log("hit left");
  } else if (playerBall.x + ballRad >= canvas.width) {
    //오른쪽 벽
    tempX = canvas.width - ballRad;
    console.log("hit right");
  }
  // console.log(joystickData.moveX, joystickData.moveY)
  return [tempX, tempY];
}

export function isBallCollision(
  ball1: TPlayerBall,
  ball2: TPlayerBall,
  ballRad: number
) {
  const radiusSum = ballRad * 2;
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  // console.log(gameData.x, gameData.y)

  if (radiusSum * radiusSum > dx * dx + dy * dy) {
    //ball collide
    return true;
  } else {
    return false;
  }
}

export function adjustPosition(
  ball1: TPlayerBall,
  ball2: TPlayerBall,
  xySpeed: number[],
  ballRad: number
) {
  const radiusSum = ballRad * 2;
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;

  const degree = Math.abs(Math.atan(dy / dx));
  const ballsDistance = Math.sqrt(dx ** 2 + dy ** 2);
  const hypotenuse = (radiusSum - ballsDistance) / 2;

  const adjustX = Math.cos(degree) * hypotenuse;
  const adjustY = Math.sin(degree) * hypotenuse;

  let xDirection;
  let yDirection;

  if (ball2.x < ball1.x && ball2.y < ball1.y) {
    xDirection = 1;
    yDirection = 1;
  } else if (ball2.x > ball1.x && ball2.y < ball1.y) {
    xDirection = -1;
    yDirection = 1;
  } else if (ball2.x > ball1.x && ball2.y > ball1.y) {
    xDirection = -1;
    yDirection = -1;
  } else if (ball2.x < ball1.x && ball2.y > ball1.y) {
    xDirection = 1;
    yDirection = -1;
  } else {
    console.log("문제가 있습니다");
    xDirection = 1;
    yDirection = 1;
  }

  return [adjustX * xDirection, adjustY * yDirection];
}

// export default function adjustPosition(ball1: playerBall, ball2: playerBall, xySpeed: number[], ballRad: number){
//   const radiusSum = ballRad * 2;
//   let dx;
//   let dy;

//   if (ball2.x < ball1.x && ball2.y < ball1.y) {
//     console.log("1분면");
//     dx = ball2.x - ball1.x;
//     dy = ball2.y - ball1.y;
//   } else if (ball2.x > ball1.x && ball2.y < ball1.y) {
//     console.log("2분면");
//     dx = ball2.x - ball1.x;
//     dy = ball1.y - ball2.y;
//   } else if (ball2.x > ball1.x && ball2.y > ball1.y) {
//     console.log("3분면");
//     dx = ball1.x - ball2.x;
//     dy = ball1.y - ball2.y;
//   } else if (ball2.x < ball1.x && ball2.y > ball1.y) {
//     console.log("4분면");
//     dx = ball1.x - ball2.x;
//     dy = ball2.y - ball1.y;
//   } else {
//     console.log("문제가 있습니다")
//     dx = ball2.x - ball1.x;
//     dy = ball2.y - ball1.y;

//     let ballsDistance = Math.sqrt((dx**2) + (dy**2));
//     let hypotenuse = (radiusSum - ballsDistance) / 2;

//     if (ball2.x === ball1.x && ball2.y < ball1.y) {
//       return [0, -hypotenuse];
//     } else if (ball2.x === ball1.x && ball2.y > ball1.y) {
//       return [0, hypotenuse];
//     } else if (ball2.y === ball1.y && ball2.x < ball1.y) {
//       return [hypotenuse, 0];
//     } else if (ball2.y === ball1.y && ball2.y > ball1.y) {
//       return [-hypotenuse, 0];
//     } else {
//       console.log("진짜 존나 문제 있습니다.")
//       return [hypotenuse, hypotenuse];
//     }
//   }

//   const degree = Math.atan(dy / dx);
//   let ballsDistance = Math.sqrt((dx**2) + (dy**2));
//   let hypotenuse = (radiusSum - ballsDistance) / 2;

//   const adjustX = Math.cos(degree) * hypotenuse;
//   const adjustY = Math.sin(degree) * hypotenuse;

//   const xDirection = xySpeed[0] / Math.abs(xySpeed[0]);
//   const yDirection = xySpeed[1] / Math.abs(xySpeed[1]);

//   if (degree === 0) {
//     // ball1.x += hypotenuse * -xDirection;
//     // ball1.y += hypotenuse * -yDirection;
//     console.log("hello")
//     return [hypotenuse * -xDirection + 1, hypotenuse * -yDirection + 1];
//   } else {
//     // ball1.x += adjustX * -xDirection;
//     // ball1.y += adjustY * -yDirection;

//     return [adjustX * -xDirection + 1, adjustY * -yDirection + 1];
//   }

// }
