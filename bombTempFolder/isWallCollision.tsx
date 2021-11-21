



export default function isWallCollision(playerBall: any, canvasHeight: any, canvasWidth: number, ballRad: number) {

  let tempX: number = playerBall.x 
  let tempY: number = playerBall.y 

  if (tempY - ballRad <= 0) { //천장
    tempY = ballRad;
    console.log("hit bottom")
  } else if (tempY + ballRad >= canvasHeight) { //바닥
    tempY = canvasHeight - ballRad;
    console.log("hit top")
  }

  if (playerBall.x - ballRad <= 0) { //왼쪽 벽
    tempX = ballRad;
    console.log("hit left")
  } else if (playerBall.x + ballRad >= canvasWidth) { //오른쪽 벽
    tempX = canvasWidth - ballRad;
    console.log("hit right")
  }
  // console.log(joystickData.moveX, joystickData.moveY)
  return [tempX, tempY];
}