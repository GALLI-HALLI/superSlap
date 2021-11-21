type playerBallType = {
  id: string;
  color: string;
  x: number;
  y: number;
  bomb: boolean;
}

export default function isBallCollision(ball1: playerBallType, ball2: playerBallType, ballRad: number){
  const radiusSum = ballRad * 2;
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  // console.log(gameData.x, gameData.y)

  if (radiusSum*radiusSum > dx*dx + dy*dy) {
    //ball collide
    return true;
  } else {
    return false;
  }
}