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

  async ranking() {
    let loserId;
    let loserScore = 999999999;
    Array.from(this.playerScores).forEach(([key, value]) => {
      if (loserScore > value.score) {
        loserId = key;
        loserScore = value.score;
      } else if (loserScore === value.score) {
        if (Math.random() >= 0.5) loserId = key;
      }
    });

    let rank = [...this.playerScores.values()];
    rank = rank.sort((a, b) => {
      return a.score - b.score;
    });
    this.comebackRoom({ loserId, rank });
  }

  initializeSocketEvents(id, socket, nickname) {
    console.log(`${id} is entered ${Date()}`);
    this.playerScores.set(id, null);

    //게임 끝 정보 받아서 넣어주기
    socket.on("lrEnd", (data) => {
      this.playerScores.set(id, { score: data, nickname });
      this.receiveDataNum++;
      if (this.receiveDataNum === this.playerScores.size) {
        this.ranking();
      }
    });
  }
}

module.exports = LeftOrRightGame;
