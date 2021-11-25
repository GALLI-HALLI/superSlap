const Game = require("./game");
const socketEvent = require("../constants/socketEvents");

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
  constructor(socket, id) {
    this.socket = socket;
    this.id = id;
    this.seq = 0;
    this.x = 0;
    this.y = 0;
    this.color = ballColor[0];
    this.bomb = false;
  }
}

class BombGame extends Game {
  constructor(room) {
    // 부모 클래스의 생성자를 호출한다.
    super(room);
    this.balls = [];
    this.ballMap = {};
    this.gameStart = false;
    this.ballSeq = [false, false, false, false, false, false, false, false];
  }

  // 폭탄 피하기 시작 하기
  start() {
    this.gameStart = true;
    this.balls[Math.floor(this.balls.length * Math.random())].bomb = true; //폭탄 랜덤생성. 해당 코드 비활성화 시 joinGame()함수에서 첫 번째 플레이어에 폭탄 true 처리하는 코드 필요함
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
    setTimeout(() => {
      this.gameStart = false;
      let loser;
      if(!this.balls || this.balls.length === 0) return;
      for (let i = 0; i < this.balls.length; i++) {
        if (this.balls[i].bomb === true) {
          loser = this.balls[i].id;
          break;
        }
      }
      let color = this.ballMap[loser].color;
      this.getRoomSocket().emit(socketEvent.gameEnd, { loser, color });
    }, 30000); //게임시작 30초 후 종료
  }

  // 유저가 나갔을때
  disconnect(id) {
    if(this.ballMap[id]){
      this.leftGame(id);
    }
    this.getRoomSocket().emit("leave_user", id); //떠날 때 id 값 송신
  }

  joinGame(socket, id) {
    let ball = new PlayerBall(socket, id);
    let startPosition = Math.floor(8 * Math.random())
    while(this.ballSeq[startPosition]){
      if(startPosition === 7){
        startPosition = 0
      }else{
        startPosition++
      }
    }
    ball.seq = startPosition;
    this.ballSeq[startPosition] = true;
    
    let seq = ball.seq;
    ball.x = 140 + 80 * (seq % 2);
    ball.y = 100 + 100 * parseInt(seq / 2);
    ball.color = ballColor[seq];
    // if (seq === 0) ball.bomb = true;//start()함수에서 폭탄랜덤생성 코드 활성화 시 해당 줄 주석처리(첫 번째 플레이어에 폭탄 부여하는 코드임)

    this.balls.push(ball);
    this.ballMap[id] = ball;

    return ball;
  }

  leftGame(id) {
    let noBomb = false;
    for (let i = 0; i < this.balls.length; i++) {
      if (this.balls[i].id === id) {
        if(this.balls[i].bomb){
          noBomb = true;
        }
        this.balls.splice(i, 1);
        break;
      }
    }

    if(noBomb && this.balls.length > 0){
      this.balls[Math.floor(this.balls.length * Math.random())].bomb = true;
    }
    this.ballSeq[this.ballMap[id].seq] = false;
    delete this.ballMap[id];
  }

  initializeSocketEvents(id, socket) {
    console.log(`${id} is entered ${Date()}`);

    //게임에 필요한 ball생성 작업
    this.joinGame(socket, id);

    //업데이트된 위치 정보 받아서
    socket.on("send_location", (data) => {
      //게임시작 여부 판별
      if (this.gameStart) {
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
