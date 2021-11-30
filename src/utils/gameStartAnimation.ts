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
    -20 + canvasWidth / 2 - canvasWidth * 1 + gameStartAnimation, //360
    canvasHeight / 2
  );
  ctx.restore();

  // 1초

  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 100px Trebuchet MS";
  ctx.fillText(
    "2",
    -20 + canvasWidth / 2 - canvasWidth * 2 + gameStartAnimation,
    canvasHeight / 2
  );
  ctx.restore();

  // 1초

  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 100px Trebuchet MS";
  ctx.fillText(
    "1",
    -20 + canvasWidth / 2 - canvasWidth * 3 + gameStartAnimation,
    canvasHeight / 2
  );
  ctx.restore();

  // 게임시작

  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 80px Trebuchet MS";
  ctx.fillText(
    "GAME",
    -120 + canvasWidth / 2 - canvasWidth * 4 + gameStartAnimation,
    canvasHeight / 2
  );
  ctx.fillStyle = "white";
  ctx.font = "bold 80px Trebuchet MS";
  ctx.fillText(
    "START!",
    -120 + canvasWidth / 2 - canvasWidth * 4 + gameStartAnimation,
    80 + canvasHeight / 2
  );
  ctx.restore();
}

export function gameStartAnimation(instance: any, canvasWidth: number) {
  // 3초
  let threeSecond = setInterval(function () {
    instance.gameStartAnimation.value += canvasWidth / 28;
    if (instance.gameStartAnimation.value >= canvasWidth) {
      instance.gameStartAnimation.value = canvasWidth;
      clearInterval(threeSecond);
    }
  }, 25); // 1000 = 1초이니 700 = 0.7초, 총 700/ 25 = 28프레임 으로 360을 나눠서 글자들 이동 및 출력
  // 2초
  setTimeout(function () {
    let twoSecond = setInterval(function () {
      instance.gameStartAnimation.value += canvasWidth / 28;
      if (instance.gameStartAnimation.value >= canvasWidth * 2) {
        instance.gameStartAnimation.value = canvasWidth * 2;
        clearInterval(twoSecond);
      }
    }, 25);
  }, 1000);
  // 1초
  setTimeout(function () {
    let oneSecond = setInterval(function () {
      instance.gameStartAnimation.value += canvasWidth / 28;
      if (instance.gameStartAnimation.value >= canvasWidth * 3) {
        instance.gameStartAnimation.value = canvasWidth * 3;
        clearInterval(oneSecond);
      }
    }, 25);
  }, 2000);

  // 게임 시작
  setTimeout(function () {
    let gameStart = setInterval(function () {
      instance.gameStartAnimation.value += canvasWidth / 14; // 350 동안 진행
      if (instance.gameStartAnimation.value >= canvasWidth * 4) {
        instance.gameStartAnimation.value = canvasWidth * 4;

        setTimeout(function () {
          instance.gameStartAnimation.value += 10000;
        }, 350);
        clearInterval(gameStart);
      }
    }, 25);
  }, 3000);
}
