const Game = require("./game");

let ballSeq = [false, false, false, false, false, false, false, false];
let ballColor = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "white",
  "hotpink",
]; //8 color setting

class PlayerBall {
  constructor(socket) {
    this.socket = socket;
    this.seq = 0;
    this.x = 0;
    this.y = 0;
    this.color = ballColor[0];
    this.bomb = false;
  }

  get id() {
    return this.socket.id;
  }
}

class BombGame extends Game {
  constructor(room) {
    // 부모 클래스의 생성자를 호출한다.
    super(room);
    this.balls = [];
    this.ballMap = {};
    this.gameStart = false;
    this.startTime = null;
  }

  // 폭탄 피하기 시작 하기
  start() {
    this.gameStart = true;
    this.startTime = Date.now() / 1000 + 60;

    //생성된 ball들의 기초 정보 전송
    for (let i = 0; i < this.balls.length; i++) {
      let ball = this.balls[i];
      this.getRoomSocket().emit("join_user", {
        id: ball.id,
        x: ball.x,
        y: ball.y,
        color: ball.color,
        bomb: ball.bomb,
      });
    }

    this.balls.forEach((ball) => {
      ball.socket.emit("user_id", ball.id);
    });

    //게임종료 신호
    setTimeout(function () {
      this.gameStart = false;
      let loser;
      for (let i = 0; i < this.balls.length; i++) {
        if (this.balls[i].bomb === true) {
          loser = this.balls[i].id;
          break;
        }
      }
      let color = this.ballMap[loser].color;
      this.getRoomSocket().emit("game_end", { loser, color });
      this.endRoom();
    }, 30000); //게임시작 30초 후 종료
  }

  // 유저가 나갔을때
  disconnect(socket) {
    this.leftGame(socket);
    socket.broadcast.emit("leave_user", socket.id); //떠날 때 socket.id 값 송신
  }

  joinGame(socket) {
    let ball = new PlayerBall(socket);
    for (let i = 0; i < 8; i++) {
      if (ballSeq[i] === false) {
        ball.seq = i;
        ballSeq[i] = true;
        break;
      }
    }
    let seq = ball.seq;
    ball.x = 140 + 80 * (seq % 2);
    ball.y = 100 + 100 * parseInt(seq / 2);
    ball.color = ballColor[seq];
    if (seq === 0) ball.bomb = true;

    this.balls.push(ball);
    this.ballMap[socket.id] = ball;

    return ball;
  }

  leftGame(socket) {
    for (let i = 0; i < this.balls.length; i++) {
      if (this.balls[i].id === socket.id) {
        this.balls.splice(i, 1);
        break;
      }
    }
    ballSeq[this.ballMap[socket.id].seq] = false;
    delete this.ballMap[socket.id];
  }

  initializeSocketEvents(socket) {
    console.log(`${socket.id} is entered ${Date()}`);

    //게임에 필요한 ball생성 작업
    this.joinGame(socket);

    socket.on("timer", (data) => {
      let timer = this.startTime - Date.now() / 1000;
    });

    //업데이트된 위치 정보 받아서
    socket.on("send_location", (data) => {
      if (this.gameStart) {
        //게임시작 여부 판별
        let info = this.ballMap[data.id];
        info.x = data.x;
        info.y = data.y;
        //각 클라이언트로 위치 정보 전송
        this.getRoomSocket().emit("update_state", {
          id: data.id,
          x: info.x,
          y: info.y,
          bomb: info.bomb,
        });
      }
    });

    //폭탄 변경 상황 정보 받아서
    socket.on("bomb_change", (data) => {
      let send = this.ballMap[data.send];
      let receive = this.ballMap[data.receive];
      send.bomb = false;
      receive.bomb = true;
      //폭탄 변경 ball 정보 전송
      this.getRoomSocket().emit("update_bomb", {
        sid: send.id,
        sbomb: send.bomb,

        rid: receive.id,
        rbomb: receive.bomb,
      });
    });
  }
}

module.exports = BombGame;
