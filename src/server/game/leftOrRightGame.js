const Game = require("./game");

class LeftOrRightGame extends Game {
  constructor(room) {
    super(room);
    this.playerScores = new Map();
    this.receiveDataNum = 0;
  }

  start() {
    console.log("Left Right game start");
  }

  // 유저가 나갔을때
  disconnect(id) {
    this.playerScores.delete(id);
  }

  ranking() {
    let loserId = [];
    let loserScore = 999999999;
    Array.from(this.playerScores).forEach(([key, value]) => {
      if (loserScore > value) {
        loserId = [];
        loserId.push(key);
        loserScore = value;
      } else if (loserScore > value) {
        loserId.push(key);
      }
    });
    this.comebackRoom({ loserId });
  }

  initializeSocketEvents(id, socket) {
    console.log(`${id} is entered ${Date()}`);
    this.playerScores.set(id, 0);

    //게임 끝 정보 받아서 넣어주기
    socket.on("lrEnd", (data) => {
      console.log(data);
      this.playerScores[id] = data;
      this.receiveDataNum++;
      if (this.receiveDataNum === this.playerScores[id].length) {
        this.ranking();
      }
    });
  }
}

module.exports = LeftOrRightGame;
