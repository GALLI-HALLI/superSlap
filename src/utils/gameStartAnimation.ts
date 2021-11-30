// gameStartAnimation 초기 값 360 * 4  정확힌 canvasWidth * 4
// 1초마다 0.7만에 +360, 0.3 동안 값 상승 정지
// 마지막에 game start! 메세지는 0.5초동안 출력

export function drawGameStart(
  ctx: any,
  canvasWidth: number,
  canvasHeight: number,
  gameStartAnimation: number
) {
  if (gameStartAnimation > 360 * 5) return; // 특정 값 이상부터 출력 정지

  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.restore();

  // 3초
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 100px Trebuchet MS";
  ctx.fillText(
    "3",
    35 + canvasWidth / 2 - gameStartAnimation / 4, //360
    canvasHeight / 2
  );
  ctx.restore();

  // 1초

  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 100px Trebuchet MS";
  ctx.fillText(
    "3",
    35 + canvasWidth / 2 - gameStartAnimation / 3,
    canvasHeight / 2
  );
  ctx.restore();

  // 1초

  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 100px Trebuchet MS";
  ctx.fillText(
    "3",
    35 + canvasWidth / 2 - gameStartAnimation / 2,
    canvasHeight / 2
  );
  ctx.restore();

  // 게임시작

  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 100px Trebuchet MS";
  ctx.fillText(
    "3",
    35 + canvasWidth / 2 - gameStartAnimation,
    canvasHeight / 2
  );
  ctx.restore();
}

export function gameStartAnimation(
  gameStartAnimation: number,
  canvasWidth: number
) {
  // 3초
  let threeSecond = setInterval(function () {
    gameStartAnimation += canvasWidth / 28;
    if (gameStartAnimation >= canvasWidth) {
      gameStartAnimation = canvasWidth;
      clearInterval(threeSecond);
    }
  }, 25); // 1000 = 1초이니 700 = 0.7초, 총 28프레임 으로 360을 나눠서 글자들 이동 및 출력
  // 2초
  setTimeout(function () {
    let twoSecond = setInterval(function () {
      gameStartAnimation += canvasWidth / 28;
      if (gameStartAnimation >= canvasWidth * 2) {
        gameStartAnimation = canvasWidth * 2;
        clearInterval(twoSecond);
      }
    }, 25);
  }, 1000);
  // 1초
  setTimeout(function () {
    let oneSecond = setInterval(function () {
      gameStartAnimation += canvasWidth / 28;
      if (gameStartAnimation >= canvasWidth * 3) {
        gameStartAnimation = canvasWidth * 3;
        clearInterval(oneSecond);
      }
    }, 25);
  }, 2000);

  // 게임 시작
  setTimeout(function () {
    let gameStart = setInterval(function () {
      gameStartAnimation += canvasWidth / 14;
      if (gameStartAnimation >= canvasWidth * 4) {
        gameStartAnimation = canvasWidth * 4;

        setTimeout(function () {
          gameStartAnimation += 1000;
        }, 700);
        clearInterval(gameStart);
      }
    }, 25);
  }, 3000);
}
